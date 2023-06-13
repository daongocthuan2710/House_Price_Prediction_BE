// double thumb slider
// custom event to fire when slider value changes
const onRangeSlide = new CustomEvent('range-change', {
    detail: {
        get values() {
            const bar = document.getElementById('slider-bar')
            if (!bar) {
                return undefined
            }
            // getting data values
            const maxBar = bar.dataset.max ? Number(bar.dataset.max) : 100
            const minBar = bar.dataset.min ? Number(bar.dataset.min) : 0
            const precision = bar.dataset.precision ? Number(bar.dataset.precision) : 0
            // sliders
            const slider1 = document.querySelector('#slider-handle-1')
            const slider2 = document.querySelector('#slider-handle-2')
            // getting slider values
            const slider1Max = Number(slider1.max)
            const slider2Max = Number(slider2.max)
            const slider1Val = Number(slider1.value)
            const slider2Val = Number(slider2.value)
            const totalSliders = slider1Max + slider2Max
            const minValue = minBar + (slider1Val/totalSliders)*(maxBar - minBar)
            const maxValue = minBar + ((slider1Max + (slider2Max - slider2Val)) / totalSliders) * (maxBar - minBar)
            // update outputs
            const out1 = document.getElementById('slider-output-1')
            const out2 = document.getElementById('slider-output-2')
            const minRange = precision ? minValue .toFixed(precision) : Math.ceil(minValue)
            const maxRange = precision ? maxValue .toFixed(precision) : Math.floor(maxValue)
            if (out1 && out2) {
                out1.textContent = minRange
                out2.textContent = maxRange
            }
            return {minRange, maxRange}   
        }
    }
})
// init slider
const initSlider = () => {
    const bar = document.getElementById('slider-bar')
    const maxBar = bar.dataset.max ? Number(bar.dataset.max) : 100
    const minBar = bar.dataset.min ? Number(bar.dataset.min) : 0
    const out1 = document.getElementById('slider-output-1')
    const out2 = document.getElementById('slider-output-2')
    if (out1 && out2) {
        out1.textContent = minBar
        out2.textContent = maxBar
    }
}
const onChangeSliderHandler = (evt) => {
    const el = evt.target
    const id = el.id
    let elWidth = el.style.width ? Number(el.style.width.replace('%', '')) : 50
    const hand2 = id === 'slider-handle-1' ? document.getElementById('slider-handle-2') : document.getElementById('slider-handle-1')
    let hand2Width = hand2.style.width ? Number(hand2.style.width.replace('%', '')) : 50
    let elMax = Number(el.max)
    let elVal = Number(el.value)
    const hand2Val = Number(hand2.value)    
    const bar = document.getElementById('slider-bar')
    const maxBar = bar.dataset.max ? Number(bar.dataset.max) : 100
    const minBar = bar.dataset.min ? Number(bar.dataset.min) : 0
    const fixer = Math.ceil(0.02 * Math.abs((maxBar - minBar)))
    
    if ((elVal >= elMax && elMax >= 50) || elVal > 50 || elVal === elMax) {
        el.max = elVal + fixer
        if (el.max >= 100) {
            el.style.width = '100%'
            elWidth = 99.99
            el.max = 100 - fixer
        } else {
            elWidth = el.max
        }
        el.style.width = `${elWidth}%`
    }
    hand2.max = 100 - el.max
    hand2Width = 100 - elWidth
    hand2.style.width = `${hand2Width}%`
    if (hand2Val >= hand2.max) {
        hand2.value = hand2.max - fixer
    }
    bar.dispatchEvent(onRangeSlide)
}
const registerSliderHandleListeners = () => {
    const handleOne = document.getElementById('slider-handle-1')
    const handleTwo = document.getElementById('slider-handle-2')
    const bar = document.getElementById('slider-bar')
    handleOne.addEventListener('input', onChangeSliderHandler)
    handleTwo.addEventListener('input', onChangeSliderHandler)
    // listen to events on slider change
    bar.addEventListener('range-change', (evt) => {
        // print values
        console.log(evt.detail.values)
    })
}

initSlider()
registerSliderHandleListeners()