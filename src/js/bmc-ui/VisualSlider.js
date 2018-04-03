'use strict';

/**
 * VisualSlider
 */
class VisualSlider extends Slider {
  constructor({ wrapperElem, dom, animation, useJsAnimation }) {
    super();

    this.dom = dom;
    this.animation = animation;
    this.useJsAnimation = useJsAnimation;
    this._createElementsData(wrapperElem);
    this._createUIData();

    this.init();
  }

  /* data */

  _createElementsData(wrapperElem) {
    this.contentBox = wrapperElem.querySelector('.img-box');
    this.contentItems = this.contentBox.querySelectorAll('.img-item');
    this.directionBtnBox = wrapperElem.querySelector('.direction-btn-box');
    this.dotBtnBox = wrapperElem.querySelector('.dot-btn-box');
    this.dotBtnItems = this.dotBtnBox.querySelectorAll('a');
  }
  _createUIData() {
    this.maxIndex = this.contentItems && this.contentItems.length;      
  }
  _changeContentBoxDatasetAnimationTypeIsJs() {
    this.contentBox.dataset.animationType = 'javascript';
  }
  
  /* init */
  
  init() {
    if (this.useJsAnimation) this._changeContentBoxDatasetAnimationTypeIsJs();
    this.activeElements(0);
    this.registerEvents();
  }

  /* ui */
  
  activeElements(i, isForceActive = false) {
    const oldIndex = this.activeIndex;
    const newIndex = this._calcSlideIndex(i || 0);
    if (!isForceActive && (oldIndex == newIndex)) { return; }

    this._updateActiveIndexData(newIndex);
    this._activeDotBtn(oldIndex, newIndex);
    if (this.useJsAnimation) { // ??? 매번 확인하지말고 최초에 activeContent메서드를 할당해서 고정할 수 없나?
      this._activeContentByJS(oldIndex, newIndex)
    } else {
      this._activeContent(oldIndex, newIndex);
    }
  }
  _activeDotBtn(oldIndex, newIndex) {
    this.dotBtnItems.item(oldIndex).classList.remove('on');
    this.dotBtnItems.item(newIndex).classList.add('on');  
  }
  _activeContentByJS(oldIndex, newIndex) {
    this._resetAnimationCSS();
    this._fadeOut(oldIndex);
    this._fadeIn(newIndex);
  }
  _resetAnimationCSS() {
    this.contentItems.forEach((elem) => {
      elem.style.transform = 'translateX(100%)';
      elem.style.opacity = 0;
      elem.style.zIndex = -1;
    });
  }
  _fadeOut(i) {
    const OPACITY_INTERVAL_VALUE = 0.11;
    const target = this.contentItems.item(i);

    target.style.transform = 'translateX(0)';
    this.animation.fadeOut(target, OPACITY_INTERVAL_VALUE);
  }
  _fadeIn(i) {
    const OPACITY_INTERVAL_VALUE = 0.08;
    const target = this.contentItems.item(i);

    target.style.transform = 'translateX(0)';
    target.style.zIndex = 0;
    this.animation.fadeIn(target, OPACITY_INTERVAL_VALUE);
  }

  /* event */
  
  registerEvents() {
    this._injectContentsIndex();
    this._injectDotBtnsIndex();

    this.directionBtnBox.addEventListener('click', (e) => e.preventDefault());
    this.directionBtnBox.addEventListener('click', this._onClickDirectionBtn.bind(this));

    this.dotBtnBox.addEventListener('click', (e) => e.preventDefault());
    this.dotBtnBox.addEventListener('click', this._onClickDotBtn.bind(this));
  }
  _injectContentsIndex() {
    this.dom.setIndex(this.contentItems);    
  }
  _injectDotBtnsIndex() {
    this.dom.setIndex(this.dotBtnItems);
  }
  _onClickDirectionBtn({ target }) {
    const oldIndex = this.activeIndex;
    const newIndex = (this._isPrevBtn(target))? oldIndex - 1 : oldIndex + 1;

    if (target && target.nodeName === 'A') { this.activeElements(newIndex); }
  }
  _onClickDotBtn({ target }) {
    if (target && target.nodeName === 'A') { this.activeElements(target.index); }
  }
}