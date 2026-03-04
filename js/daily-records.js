;(function () {
  function pad(num) {
    return String(num).padStart(2, '0')
  }

  function toDateKey(date) {
    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`
  }

  function parseJsonAttr(el, attrName) {
    try {
      return JSON.parse(el.getAttribute(attrName) || '[]')
    } catch (error) {
      return []
    }
  }

  function renderCalendar(root, state) {
    const daysEl = root.querySelector('.js-cal-days')
    if (!daysEl) return

    const year = state.viewDate.getFullYear()
    const month = state.viewDate.getMonth()
    const firstDay = new Date(year, month, 1)
    const startWeek = firstDay.getDay()
    const totalDays = new Date(year, month + 1, 0).getDate()
    const today = new Date()
    const thisMonth = today.getFullYear() === year && today.getMonth() === month
    const titleEl = root.querySelector('.js-cal-today')

    if (titleEl) {
      titleEl.textContent = `${year}年${month + 1}月`
      titleEl.title = '点击回到本月'
    }

    daysEl.innerHTML = ''

    for (let i = 0; i < startWeek; i++) {
      const empty = document.createElement('span')
      empty.className = 'daily-day is-empty'
      daysEl.appendChild(empty)
    }

    for (let day = 1; day <= totalDays; day++) {
      const current = new Date(year, month, day)
      const key = toDateKey(current)
      const btn = document.createElement('button')
      btn.type = 'button'
      btn.className = 'daily-day'
      btn.textContent = String(day)

      if (state.recordSet.has(key)) btn.classList.add('has-record')
      if (state.commitSet.has(key)) btn.classList.add('has-commit')
      if (thisMonth && day === today.getDate()) btn.classList.add('is-today')

      daysEl.appendChild(btn)
    }
  }

  function mountCalendar(root) {
    if (!root || root.dataset.mounted === '1') return

    const dates = parseJsonAttr(root, 'data-dates')
    const commitDates = parseJsonAttr(root, 'data-commit-dates')
    const state = {
      recordSet: new Set(dates),
      commitSet: new Set(commitDates),
      viewDate: new Date()
    }

    const prev = root.querySelector('.js-cal-prev')
    const next = root.querySelector('.js-cal-next')
    const today = root.querySelector('.js-cal-today')

    if (prev) {
      prev.addEventListener('click', function () {
        state.viewDate = new Date(state.viewDate.getFullYear(), state.viewDate.getMonth() - 1, 1)
        renderCalendar(root, state)
      })
    }

    if (next) {
      next.addEventListener('click', function () {
        state.viewDate = new Date(state.viewDate.getFullYear(), state.viewDate.getMonth() + 1, 1)
        renderCalendar(root, state)
      })
    }

    if (today) {
      today.addEventListener('click', function () {
        state.viewDate = new Date()
        renderCalendar(root, state)
      })
    }

    renderCalendar(root, state)
    root.dataset.mounted = '1'
  }

  function initDailyCalendars() {
    document.querySelectorAll('.js-daily-calendar').forEach(mountCalendar)
  }

  function mountDailyFilter(root) {
    if (!root || root.dataset.filterMounted === '1') return

    const buttons = root.querySelectorAll('.daily-filter-btn')
    const groups = root.querySelectorAll('.daily-category-group')
    const empty = root.querySelector('.js-daily-empty')

    if (!buttons.length || !groups.length) return

    function applyFilter(category) {
      let visibleCount = 0

      buttons.forEach((button) => {
        button.classList.toggle('is-active', button.dataset.category === category)
      })

      groups.forEach((group) => {
        const matched = category === '全部' || group.dataset.category === category
        group.style.display = matched ? '' : 'none'
        if (matched) visibleCount += 1
      })

      if (empty) {
        empty.style.display = visibleCount > 0 ? 'none' : ''
      }
    }

    buttons.forEach((button) => {
      button.addEventListener('click', function () {
        applyFilter(button.dataset.category || '全部')
      })
    })

    applyFilter('全部')
    root.dataset.filterMounted = '1'
  }

  function initDailyFilters() {
    document.querySelectorAll('.js-daily-filter').forEach(mountDailyFilter)
  }

  document.addEventListener('DOMContentLoaded', initDailyCalendars)
  document.addEventListener('DOMContentLoaded', initDailyFilters)
  document.addEventListener('pjax:complete', initDailyCalendars)
  document.addEventListener('pjax:complete', initDailyFilters)
})()
