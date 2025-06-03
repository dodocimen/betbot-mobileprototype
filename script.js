document.addEventListener('DOMContentLoaded', () => {
    const sidebarManager = {
        sidebarElement: document.getElementById('sidebar'),
        hamburgerMenuButton: document.querySelector('.hamburger-menu'),
        closeSidebarButton: document.querySelector('.close-sidebar-button'),
        pageOverlayElement: document.querySelector('.page-overlay'),
        bodyElement: document.body,

        init() {
            if (!this.sidebarElement || !this.hamburgerMenuButton || !this.closeSidebarButton || !this.pageOverlayElement) {
                return;
            }
            this.hamburgerMenuButton.addEventListener('click', () => this.openSidebar());
            this.closeSidebarButton.addEventListener('click', () => this.closeSidebar());
            this.pageOverlayElement.addEventListener('click', () => this.closeSidebar());
            document.addEventListener('keydown', (event) => {
                if (event.key === 'Escape' && this.isSidebarOpen()) {
                    this.closeSidebar();
                }
            });
        },
        openSidebar() {
            this.sidebarElement.classList.add('active');
            this.sidebarElement.setAttribute('aria-hidden', 'false');
            this.hamburgerMenuButton.setAttribute('aria-expanded', 'true');
            this.bodyElement.classList.add('sidebar-open');
            this.pageOverlayElement.classList.add('active');
        },
        closeSidebar() {
            this.sidebarElement.classList.remove('active');
            this.sidebarElement.setAttribute('aria-hidden', 'true');
            this.hamburgerMenuButton.setAttribute('aria-expanded', 'false');
            this.bodyElement.classList.remove('sidebar-open');
            this.pageOverlayElement.classList.remove('active');
        },
        isSidebarOpen() {
            return this.sidebarElement.classList.contains('active');
        }
    };
    sidebarManager.init();

    const filterManager = {
        filterBar: document.querySelector('.filter-bar'),
        ellipsisButton: document.querySelector('.filter-ellipsis-btn'),
        filterPopup: document.getElementById('filterPopup'),
        closePopupButton: document.querySelector('.close-filter-popup-btn'),
        filterOptionsContainer: document.querySelector('.filter-popup-content'),
        chatInputBarSectionElement: document.getElementById('chatInputBarSection'),
        activeFilters: new Set(),

        init() {
            if (!this.filterBar || !this.ellipsisButton || !this.filterPopup || !this.closePopupButton || !this.filterOptionsContainer || !this.chatInputBarSectionElement) {
                return;
            }

            this.ellipsisButton.addEventListener('click', (e) => {
                e.stopPropagation();
                this.togglePopup();
            });
            this.closePopupButton.addEventListener('click', () => this.closePopup());
            
            this.filterOptionsContainer.addEventListener('click', (e) => {
                if (e.target.classList.contains('filter-option-btn')) {
                    const optionButton = e.target;
                    const filterValue = optionButton.dataset.filterValue;

                    if (this.activeFilters.has(filterValue)) {
                        const activeBtnInBar = this.filterBar.querySelector(`.active-filter-btn[data-filter-value="${filterValue}"]`);
                        if (activeBtnInBar) {
                            this.handleRemoveFilter(activeBtnInBar);
                        }
                    } else {
                        this.handleAddFilter(optionButton);
                    }
                }
            });

            this.filterBar.addEventListener('click', (e) => {
                if (e.target.classList.contains('active-filter-btn')) {
                    this.handleRemoveFilter(e.target);
                }
            });

            document.addEventListener('click', (e) => {
                if (this.isPopupOpen() && !this.filterPopup.contains(e.target) && e.target !== this.ellipsisButton) {
                    this.closePopup();
                }
            });
            
            document.addEventListener('keydown', (event) => {
                if (event.key === 'Escape' && this.isPopupOpen()) {
                    this.closePopup();
                }
            });
        },
        
        updatePopupPosition() {
            if (!this.chatInputBarSectionElement || !this.filterPopup) return;
            const chatBarHeight = this.chatInputBarSectionElement.offsetHeight;
            const popupMarginFromChatBar = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--filter-popup-margin-from-chat-bar') || '10px', 10);
            this.filterPopup.style.bottom = (chatBarHeight + popupMarginFromChatBar) + 'px';
        },

        togglePopup() {
            if (this.isPopupOpen()) {
                this.closePopup();
            } else {
                this.filterPopup.style.left = '50%'; 
                this.filterPopup.style.transform = `translateX(-50%) translateY(${getComputedStyle(document.documentElement).getPropertyValue('--filter-popup-initial-offset-y') || '10px'})`;
                this.updatePopupPosition();
                
                requestAnimationFrame(() => {
                    this.filterPopup.classList.add('active');
                    this.filterPopup.hidden = false;
                    this.ellipsisButton.setAttribute('aria-expanded', 'true');
                });
            }
        },

        closePopup() {
            if(!this.isPopupOpen()) return;
            this.filterPopup.classList.remove('active');
            this.ellipsisButton.setAttribute('aria-expanded', 'false');
            
            const handleTransitionEnd = () => {
                if (!this.isPopupOpen()) {
                    this.filterPopup.hidden = true;
                }
                this.filterPopup.removeEventListener('transitionend', handleTransitionEnd);
            };
            this.filterPopup.addEventListener('transitionend', handleTransitionEnd);
            this.filterPopup.style.transform = `translateX(-50%) translateY(${getComputedStyle(document.documentElement).getPropertyValue('--filter-popup-initial-offset-y') || '10px'})`;
        },

        isPopupOpen() {
            return this.filterPopup.classList.contains('active');
        },

        handleAddFilter(optionButton) {
            const filterName = optionButton.dataset.filterName;
            const filterValue = optionButton.dataset.filterValue;

            if (this.activeFilters.has(filterValue)) return;

            this.activeFilters.add(filterValue);
            optionButton.classList.add('selected');

            const activeBtn = document.createElement('button');
            activeBtn.classList.add('active-filter-btn');
            activeBtn.textContent = filterName;
            activeBtn.dataset.filterValue = filterValue;
            activeBtn.dataset.filterName = filterName;
            
            this.filterBar.appendChild(activeBtn);
            if (typeof layoutManager !== 'undefined') {
                layoutManager.updateFixedBottomElements();
            }
        },

        handleRemoveFilter(activeBtnInBar) {
            const filterValue = activeBtnInBar.dataset.filterValue;

            if (this.activeFilters.has(filterValue)) {
                this.activeFilters.delete(filterValue);

                const optionButtonInPopup = this.filterOptionsContainer.querySelector(`.filter-option-btn[data-filter-value="${filterValue}"]`);
                if (optionButtonInPopup) {
                    optionButtonInPopup.classList.remove('selected');
                }
            }
            activeBtnInBar.remove();
            if (typeof layoutManager !== 'undefined') {
                layoutManager.updateFixedBottomElements();
            }
        }
    };
    filterManager.init();

    const layoutManager = {
        chatInputBarSection: document.getElementById('chatInputBarSection'),
        trendsSection: document.getElementById('trendsSection'),
        mainContentElement: document.querySelector('.main-content'),
        bodyElement: document.body,
        trendsSectionHeight: 0, 
        chatBarHeight: 0,

        init() {
            if (!this.chatInputBarSection || !this.trendsSection || !this.mainContentElement || !this.bodyElement) return;

            this.trendsSectionHeight = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--trends-section-height')) || 120;
            
            const updateDimensionsAndPositions = () => {
                if(this.chatInputBarSection) { 
                    this.chatBarHeight = this.chatInputBarSection.offsetHeight;
                }
                this.updatePositions();
            };
            
            if (typeof ResizeObserver !== 'undefined') {
                const chatBarObserver = new ResizeObserver(entries => {
                    for (let entry of entries) {
                        this.chatBarHeight = entry.target.offsetHeight; 
                        this.updatePositions();
                    }
                });
                if(this.chatInputBarSection) {
                    chatBarObserver.observe(this.chatInputBarSection);
                }
            } else {
                updateDimensionsAndPositions(); 
                window.addEventListener('resize', updateDimensionsAndPositions);
            }
            requestAnimationFrame(updateDimensionsAndPositions);
        },

        updatePositions() {
            if (!this.trendsSection || !this.mainContentElement || !this.bodyElement || !this.chatInputBarSection) return;
            
            this.trendsSection.style.bottom = this.chatBarHeight + 'px';
            this.mainContentElement.style.paddingBottom = (this.chatBarHeight + this.trendsSectionHeight) + 'px';
            this.bodyElement.style.paddingBottom = '0px'; 
            
            if (filterManager.isPopupOpen()){
                 filterManager.updatePopupPosition();
            }
        },
        updateFixedBottomElements() { 
            if (typeof ResizeObserver === 'undefined') { 
                if(this.chatInputBarSection) {
                    this.chatBarHeight = this.chatInputBarSection.offsetHeight;
                }
            }
            this.updatePositions();
        }
    };
    layoutManager.init();

    const chatRedirectManager = {
        chatInputElement: document.querySelector('.chat-input'),
        sendButtonElement: document.querySelector('.chat-send-btn'),

        init() {
            if (!this.chatInputElement || !this.sendButtonElement) {
                return;
            }

            this.chatInputElement.addEventListener('keydown', (event) => {
                if (event.key === 'Enter') {
                    event.preventDefault(); 
                    this.redirectToDashboard();
                }
            });

            this.sendButtonElement.addEventListener('click', () => {
                this.redirectToDashboard();
            });
        },

        redirectToDashboard() {
            window.location.href = 'dashboard.html';
        }
    };
    chatRedirectManager.init();

});