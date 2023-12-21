window.addEventListener('DOMContentLoaded', () => {

    if ( location.pathname === '/') {
        configureSliders();
        animateSliders();
        addSliderSelector();
        sliderIndicators();
        firstIndicator();
    }
});

let counter = 0;
const INTERVAL = 1000;

const getSliders = () => {
    return document.querySelectorAll('.slider_container .slider');
}

const getSliderContainer = () => {
    return document.querySelector('.slider_container');
}

const configureSliders = () => {

    const sliders = getSliders();
    
    if(sliders != undefined){

        sliders.forEach((slider, index) => {
            slider.style.left = `${index * 100}%`;
        });
    }
}

const animateSliders = () => {
    
    const sliders = getSliders();

    setInterval(() => {

        counter += 1;

        if (sliders != undefined){
            if ( counter > sliders.length - 1 ) {
                counter = 0;
            }
            sliders.forEach(slider => {
                slider.style.transform = `translateX(-${counter * 100}%)`;
            });
        }

        addSliderSelector();
        addIndicatorsSelector();

    }, INTERVAL * 4)
}

const addSliderSelector = () => {

    const sliders = getSliders();

    if (sliders != undefined) {

        sliders.forEach(slider => {
            slider.classList.remove('active_slider');
        });

        sliders[counter].classList.add('active_slider');
    }
}

const sliderIndicators = () => {

    const sliderContainer = getSliderContainer();
    const sliders = getSliders();

    const sliderIndicators = document.createElement('div');
    sliderIndicators.className = 'slider_indicators';
    sliderContainer.appendChild(sliderIndicators);

    if ( sliders != undefined ) {

        sliders.forEach(slider => {
            
            const indicator = document.createElement('span');
            sliderIndicators.appendChild(indicator);

        });
    }
}

const addIndicatorsSelector = () => {

    const sliderIndicators = document.querySelectorAll('.slider_indicators span');
    sliderIndicators[0].classList.add('active_indicator');

    if ( sliderIndicators != undefined ) {
        sliderIndicators.forEach(indicator => {
            indicator.classList.remove('active_indicator');
        })
    }
    sliderIndicators[counter].classList.add('active_indicator');
}

const firstIndicator = () => {

    const sliderIndicators = document.querySelectorAll('.slider_indicators span');
    if ( sliderIndicators != undefined ) {
        sliderIndicators[0].classList.add('active_indicator');
    }
}