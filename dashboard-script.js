// dashboard-script.js

document.addEventListener("DOMContentLoaded", () => {
  // -------------------------
  // Like Button Functionality
  // -------------------------
  const likeButtons = document.querySelectorAll(".like-btn");
  likeButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      btn.classList.toggle("liked");
    });
  });



  // ---------------------------------------
  // AI Summary Section Collapse/Expand Logic
  // ---------------------------------------
  const collapseAISummaryBtn = document.getElementById("collapse-summary");
  const aiSummaryContent = document.getElementById("summary-content");
  const aiSummaryTitleArea = document.querySelector(".summary-box-title");

  function toggleAISummaryCollapse() {
    collapseAISummaryBtn.classList.toggle("collapsed");
    aiSummaryContent.classList.toggle("collapsed");

    const summaryBox = document.querySelector(".summary-box");
    const isCollapsed = aiSummaryContent.classList.contains("collapsed");

    if (summaryBox) {
      summaryBox.style.borderRadius = isCollapsed ? "0 0 12px 12px" : "0 0 50px 50px";
    }
  }

  if (collapseAISummaryBtn && aiSummaryContent) {
    if (aiSummaryContent.classList.contains("collapsed")) {
      collapseAISummaryBtn.classList.add("collapsed");
    }
    collapseAISummaryBtn.addEventListener("click", (evt) => {
      evt.stopPropagation();
      toggleAISummaryCollapse();
    });
    if (aiSummaryTitleArea) {
      aiSummaryTitleArea.style.cursor = "pointer";
      aiSummaryTitleArea.addEventListener("click", (evt) => {
        if (evt.target.closest("#collapse-summary")) return;
        toggleAISummaryCollapse();
      });
    }
  }

  // -----------------------------------------
  // Live Odds & Team Stats Collapse/Expand Logic
  // -----------------------------------------
  const collapseLiveOddsBtn = document.getElementById("collapse-live-odds");
  const liveOddsContent = document.getElementById("live-odds-content");
  const liveOddsTitle = document.querySelector(".live-odds-title");
  const liveOddsDescriptionRow = document.querySelector(
    ".live-odds-header .live-odds-description-row"
  );

  function toggleLiveOddsCollapse() {
    collapseLiveOddsBtn.classList.toggle("collapsed");
    liveOddsContent.classList.toggle("collapsed");
  }

  if (collapseLiveOddsBtn && liveOddsContent) {
    if (liveOddsContent.classList.contains("collapsed")) {
      collapseLiveOddsBtn.classList.add("collapsed");
    }
    collapseLiveOddsBtn.addEventListener("click", (evt) => {
      evt.stopPropagation();
      toggleLiveOddsCollapse();
    });
    if (liveOddsTitle) {
      liveOddsTitle.style.cursor = "pointer";
      liveOddsTitle.addEventListener("click", () => {
        toggleLiveOddsCollapse();
      });
    }
    if (liveOddsDescriptionRow) {
      liveOddsDescriptionRow.style.cursor = "pointer";
      liveOddsDescriptionRow.addEventListener("click", (evt) => {
        if (evt.target.closest("#collapse-live-odds")) return;
        toggleLiveOddsCollapse();
      });
    }
  }

  // -----------------------------------
  // Generic Subcategory Collapse/Expand
  // -----------------------------------
  const subcategoryHeaders = document.querySelectorAll(".subcategory-header");
  subcategoryHeaders.forEach((header) => {
    const collapseBtn = header.querySelector(".subcategory-collapse-btn");
    const titleElement = header.querySelector(".subcategory-title");

    if (collapseBtn) {
      const targetId = collapseBtn.dataset.target;
      const contentToCollapse = document.getElementById(targetId);

      if (contentToCollapse) {
        if (contentToCollapse.classList.contains("collapsed")) {
          collapseBtn.classList.add("collapsed");
        } else {
          collapseBtn.classList.remove("collapsed");
        }

        const toggleCollapse = () => {
          collapseBtn.classList.toggle("collapsed");
          contentToCollapse.classList.toggle("collapsed");
        };

        collapseBtn.addEventListener("click", (evt) => {
          evt.stopPropagation();
          toggleCollapse();
        });

        if (titleElement) {
          titleElement.style.cursor = "pointer";
          titleElement.addEventListener("click", (evt) => {
            if (
              evt.target.closest(
                ".subcategory-collapse-btn, .subcategory-info-btn"
              )
            )
              return;
            toggleCollapse();
          });
        }
      } else {
        console.warn(
          "No subcategory content found for ID:",
          targetId,
          "– subcategory header:",
          header
        );
      }
    }
  });

  // ----------------------
  // Tab Functionality
  // ----------------------
  const allTabButtons = document.querySelectorAll(
    ".tab-button, .subcategory-tab, .summary-tab"
  );

  allTabButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const targetTabId = button.dataset.tab;
      const tabGroup = button.closest(".summary-tabs, .subcategory-tabs");

      if (tabGroup) {
        tabGroup
          .querySelectorAll(".summary-tab, .subcategory-tab")
          .forEach((btn) => btn.classList.remove("active"));
      } else {
        const genericTabGroup = button.closest(".tabs-container");
        if (genericTabGroup) {
          genericTabGroup
            .querySelectorAll(".tab-button")
            .forEach((btn) => btn.classList.remove("active"));
        }
      }
      button.classList.add("active");

      if (button.classList.contains("subcategory-tab")) {
        const contentContainer = button.closest(".subcategory-content");
        if (contentContainer) {
          contentContainer
            .querySelectorAll(".subcategory-tab-content")
            .forEach((content) => {
              if (content.id === targetTabId + "-content") {
                content.classList.add("active");
              } else {
                content.classList.remove("active");
              }
            });
        } else {
          const parentSubcategory = button.closest(".odds-subcategory");
          if (parentSubcategory) {
            parentSubcategory
              .querySelectorAll(".subcategory-tab-content")
              .forEach((content) => {
                if (content.id === targetTabId + "-content") {
                  content.classList.add("active");
                } else {
                  content.classList.remove("active");
                }
              });
          }
        }
      }
    });
  });

  // --------------------------------------
  // Odds Refresh Button Cooldown Functionality
  // --------------------------------------
  const refreshButtons = document.querySelectorAll(".refresh-odds-btn");

  refreshButtons.forEach((button) => {
    let lastClickTime = 0;
    const buttonTextSpan = button.querySelector(".btn-text") || button;
    const originalText = buttonTextSpan.textContent;
    const icon = button.querySelector(".refresh-icon");
    const cooldownTime =
      Number.parseInt(button.dataset.cooldownSeconds || "10", 10) * 1000;

    button.addEventListener("click", () => {
      const now = Date.now();
      if (
        button.disabled ||
        (now - lastClickTime < cooldownTime && lastClickTime !== 0)
      ) {
        return;
      }
      lastClickTime = now;

      if (icon) icon.classList.add("rotating");
      button.disabled = true;
      button.classList.add("cooldown");
      buttonTextSpan.textContent = "Refreshing...";

      const oddsGroup = button.closest(".live-odds-group");
      const oddsValueElement = oddsGroup?.querySelector(
        ".live-odds-group-value"
      );
      const oddsDateElement = oddsGroup?.querySelector(
        ".live-odds-group-date"
      );

      setTimeout(() => {
        if (icon) icon.classList.remove("rotating");

        if (oddsValueElement) {
          const currentOddsText = oddsValueElement.textContent;
          let currentOdds = Number.parseFloat(
            currentOddsText.replace(/[^-+\d.]/g, "")
          );
          if (isNaN(currentOdds)) currentOdds = 0;

          const change = (Math.random() * 10 - 5).toFixed(0);
          const newOdds = currentOdds + Number.parseInt(change, 10);
          oddsValueElement.textContent =
            (newOdds >= 0 ? "+" : "") + newOdds;
          oddsValueElement.classList.add("refreshed-animation");
          setTimeout(
            () => oddsValueElement.classList.remove("refreshed-animation"),
            600
          );
        }
        if (oddsDateElement) {
          const nowDate = new Date();
          oddsDateElement.textContent = `Last updated: ${nowDate.toLocaleTimeString(
            [],
            { hour: "2-digit", minute: "2-digit" }
          )}`;
          oddsDateElement.classList.add("refreshed-animation");
          setTimeout(
            () => oddsDateElement.classList.remove("refreshed-animation"),
            600
          );
        }

        let remainingTime = Math.floor(cooldownTime / 1000);
        if (icon && buttonTextSpan !== button) button.prepend(icon);
        buttonTextSpan.innerHTML = `Next refresh in <em>${remainingTime}s</em>`;

        const countdownInterval = setInterval(() => {
          remainingTime--;
          if (remainingTime > 0) {
            if (icon && buttonTextSpan !== button) button.prepend(icon);
            buttonTextSpan.innerHTML = `Next refresh in <em>${remainingTime}s</em>`;
          } else {
            clearInterval(countdownInterval);
            button.disabled = false;
            button.classList.remove("cooldown");
            if (icon && buttonTextSpan !== button) button.prepend(icon);
            buttonTextSpan.textContent = originalText;
            lastClickTime = 0;
          }
        }, 1000);
      }, 1500);
    });
  });

  // -----------------------------------------
  // News & Media Section Collapse/Expand Logic
  // -----------------------------------------
  const collapseNewsMediaBtn = document.getElementById("collapse-news-media");
  const newsMediaContent = document.getElementById("news-media-content");
  const newsMediaTitle = document.querySelector(".news-media-title");
  const newsMediaDescriptionRow = document.querySelector(
    ".news-media-header .news-media-description-row"
  );

  function toggleNewsMediaCollapse() {
    collapseNewsMediaBtn.classList.toggle("collapsed");
    newsMediaContent.classList.toggle("collapsed");
  }

  if (collapseNewsMediaBtn && newsMediaContent) {
    if (newsMediaContent.classList.contains("collapsed")) {
      collapseNewsMediaBtn.classList.add("collapsed");
    }
    collapseNewsMediaBtn.addEventListener("click", (evt) => {
      evt.stopPropagation();
      toggleNewsMediaCollapse();
    });
    if (newsMediaTitle) {
      newsMediaTitle.style.cursor = "pointer";
      newsMediaTitle.addEventListener("click", () => {
        toggleNewsMediaCollapse();
      });
    }
    if (newsMediaDescriptionRow) {
      newsMediaDescriptionRow.style.cursor = "pointer";
      newsMediaDescriptionRow.addEventListener("click", (evt) => {
        if (evt.target.closest("#collapse-news-media")) return;
        toggleNewsMediaCollapse();
      });
    }
  }

  // -----------------------------------------
  // Social Card Expand/Collapse Functionality
  // -----------------------------------------
  const socialCards = document.querySelectorAll(".social-card");
  socialCards.forEach((card) => {
    const seeFullPostLink = card.querySelector(".see-full-post");
    const seeFullPostTextSpan = card.querySelector(".see-full-post-text");
    const contentWrapper = card.querySelector(
      ".social-card-content-wrapper"
    );

    function toggleCardExpansion() {
      card.classList.toggle("expanded");
      if (contentWrapper) {
        contentWrapper.classList.toggle("expanded");
      }
      if (seeFullPostTextSpan) {
        if (card.classList.contains("expanded")) {
          seeFullPostTextSpan.textContent = "See less post";
        } else {
          seeFullPostTextSpan.textContent = "See full post";
        }
      }
    }

    if (seeFullPostLink) {
      seeFullPostLink.addEventListener("click", (evt) => {
        evt.preventDefault();
        evt.stopPropagation();
        toggleCardExpansion();
      });
    }

    card.addEventListener("click", (evt) => {
      if (
        evt.target.closest(
          "a, button, .see-full-post, input, textarea, select, .social-card-footer"
        )
      ) {
        return;
      }
      toggleCardExpansion();
    });
  });

  // ------------------------------------
  // News Card "Read More"/"Read Less"
  // ------------------------------------
  document
    .querySelectorAll(".news-card .read-more-btn")
    .forEach((button) => {
      const cardBody = button.closest(".news-card-body-section");
      if (!cardBody) return;

      const paragraphWrapper = cardBody.querySelector(
        ".news-body-paragraph-wrapper"
      );
      const paragraphElement = paragraphWrapper
        ? paragraphWrapper.querySelector(".news-body-paragraph")
        : null;
      if (!paragraphWrapper || !paragraphElement) return;

      if (!paragraphElement.dataset.fullText) {
        paragraphElement.dataset.fullText = paragraphElement.innerHTML.trim();
      }
      const fullText = paragraphElement.dataset.fullText;
      const previewCharLimit = 120;

      let isExpanded = paragraphWrapper.classList.contains("expanded");

      function updateParagraph() {
        if (isExpanded) {
          paragraphElement.innerHTML = fullText;
          paragraphWrapper.classList.add("expanded");
          button.textContent = "Read less";
        } else {
          const textToTruncate =
            paragraphElement.textContent || paragraphElement.innerText;
          if (textToTruncate.length > previewCharLimit) {
            let truncated = textToTruncate.substring(0, previewCharLimit);
            const lastSpace = truncated.lastIndexOf(" ");
            if (lastSpace > 0 && textToTruncate.length > previewCharLimit) {
              truncated = truncated.substring(0, lastSpace);
            }
            paragraphElement.innerHTML = truncated + ".";
          } else {
            paragraphElement.innerHTML = textToTruncate.replace(/\.\.\.$/, "");
          }
          paragraphWrapper.classList.remove("expanded");
          button.textContent = "Read more";
        }
      }

      if (!isExpanded) {
        updateParagraph();
      } else {
        paragraphElement.innerHTML = fullText;
        button.textContent = "Read less";
      }

      button.addEventListener("click", () => {
        isExpanded = !isExpanded;
        updateParagraph();
      });
    });

  // -------------------------
  // Video Gallery Functionality
  // -------------------------
  const galleryContainer = document.querySelector(".video-gallery-container");
  if (galleryContainer) { // Check if galleryContainer exists
    const videoSlides = Array.from(
      galleryContainer.querySelectorAll(".video-slide")
    );
    const indicatorsContainer = document.querySelector(".video-indicators");
    const indicators = indicatorsContainer ? Array.from(indicatorsContainer.querySelectorAll(".indicator")) : [];


    function extractYouTubeID(thumbnailUrl) {
      if (!thumbnailUrl) return null;
      const parts = thumbnailUrl.split("/vi/");
      if (parts.length < 2) return null;
      return parts[1].split("/")[0];
    }

    videoSlides.forEach((slide) => {
      const thumbnailDiv = slide.querySelector(".video-thumbnail");
      const playButton = thumbnailDiv.querySelector(".play-btn");
      const thumbnailImg = thumbnailDiv.querySelector("img");

      playButton.addEventListener("click", () => {
        const videoID = extractYouTubeID(thumbnailImg ? thumbnailImg.src : null);
        if (!videoID) {
          console.error("Could not extract YouTube ID from thumbnail:", thumbnailImg ? thumbnailImg.src : 'No image found');
          return;
        }

        const iframe = document.createElement("iframe");
        iframe.src = `https://www.youtube.com/embed/${videoID}?autoplay=1`;
        iframe.setAttribute("frameborder", "0");
        iframe.setAttribute(
          "allow",
          "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        );
        iframe.setAttribute("allowfullscreen", "");

        iframe.style.position = "absolute";
        iframe.style.top = "0";
        iframe.style.left = "0";
        iframe.style.width = "100%";
        iframe.style.height = "100%";

        thumbnailDiv.innerHTML = "";
        thumbnailDiv.appendChild(iframe);
      });
    });

    if (indicators.length > 0) {
        indicators.forEach((dot, idx) => {
            dot.addEventListener("click", () => {
            const slideWidth = galleryContainer.clientWidth;
            galleryContainer.scrollTo({
                left: idx * slideWidth,
                behavior: "smooth",
            });
            });
        });

        const observerOptions = {
            root: galleryContainer,
            threshold: 0.5,
        };

        let activeIndex = 0;
        const observerCallback = (entries) => {
            entries.forEach((entry) => {
            const slideElement = entry.target;
            const index = videoSlides.indexOf(slideElement);
            if (entry.isIntersecting) {
                activeIndex = index;
                indicators.forEach((dot, idx) => {
                dot.classList.toggle("active", idx === activeIndex);
                });
            }
            });
        };

        const observer = new IntersectionObserver(observerCallback, observerOptions);
        videoSlides.forEach((slide) => observer.observe(slide));

        // Re-observe on load/resize to handle dynamic changes
        const reobserveSlides = () => {
            videoSlides.forEach((slide) => observer.unobserve(slide));
            videoSlides.forEach((slide) => observer.observe(slide));
             // Ensure the first indicator is active if gallery is at the start
            if (galleryContainer.scrollLeft < galleryContainer.clientWidth / 2 && indicators.length > 0) {
                indicators.forEach((dot, idx) => dot.classList.toggle("active", idx === 0));
            }
        };
        window.addEventListener("load", reobserveSlides);
        window.addEventListener("resize", reobserveSlides);
    }


  } // End check for galleryContainer

  // ----------------------------------------------
  // Alternative Picks & Storylines Collapse/Expand
  // ----------------------------------------------
  const collapseAltPicksBtn = document.getElementById("collapse-alt-picks");
  const altPicksContent = document.getElementById("alt-picks-content");
  const altPicksTitle = document.querySelector(".alt-picks-title");
  const altPicksRowDesc = document.querySelector(".alt-picks-description-row");

  function toggleAltPicksCollapse() {
    collapseAltPicksBtn.classList.toggle("collapsed");
    altPicksContent.classList.toggle("collapsed");
  }

  if (collapseAltPicksBtn && altPicksContent) {
    // collapseAltPicksBtn.classList.add("collapsed"); // Default to collapsed
    // altPicksContent.classList.add("collapsed");   // Default to collapsed

    collapseAltPicksBtn.addEventListener("click", (evt) => {
      evt.stopPropagation();
      toggleAltPicksCollapse();
    });

    if (altPicksTitle) {
      altPicksTitle.style.cursor = "pointer";
      altPicksTitle.addEventListener("click", () => {
        toggleAltPicksCollapse();
      });
    }

    if (altPicksRowDesc) {
      altPicksRowDesc.style.cursor = "pointer";
      altPicksRowDesc.addEventListener("click", (evt) => {
        if (evt.target.closest("#collapse-alt-picks")) return;
        toggleAltPicksCollapse();
      });
    }
  }

  // ---------------------------------------------
  // Team Card Expand/Collapse Inside Alt Picks
  // ---------------------------------------------
  const teamCardHeaders = document.querySelectorAll(".team-card"); // Target whole card for click
  teamCardHeaders.forEach((card) => {
    const header = card.querySelector(".team-card-header");
    const expandBtn = header ? header.querySelector(".team-card-expand-btn") : null;
    const contentId = expandBtn ? expandBtn.dataset.target : null;
    const contentElement = contentId ? document.getElementById(contentId) : null;

    if (!header || !expandBtn || !contentElement) return;

    const toggleTeamCard = () => {
      expandBtn.classList.toggle("collapsed");
      contentElement.classList.toggle("collapsed");
    };

    header.addEventListener("click", (evt) => {
      // Allow clicks on buttons inside the header without toggling
      if (evt.target.closest("button") && evt.target !== expandBtn && !expandBtn.contains(evt.target)) {
        return;
      }
      toggleTeamCard();
    });
  });


  // ----------------------------------------------------
  // Prompt Summary Section Minimize/Expand on Scroll
  // ----------------------------------------------------
  const promptSummarySection = document.querySelector(".prompt-summary-section");

  if (promptSummarySection) {
    let lastScrollTop = 0;
    const scrollThreshold = 10; // How many pixels to scroll before checking direction

    window.addEventListener(
      "scroll",
      () => {
        let scrollTop = window.pageYOffset || document.documentElement.scrollTop;

        // Make sure scroll change is significant
        if (Math.abs(lastScrollTop - scrollTop) <= scrollThreshold && scrollTop > 0) { // scrollTop > 0 ensures it still works at the very top
          return;
        }

        if (scrollTop > lastScrollTop && scrollTop > 50) {
          // Scrolling Down and past 50px from top
          promptSummarySection.classList.add("minimized");
        } else {
          // Scrolling Up or at the very top (less than 50px from top)
          if (scrollTop < lastScrollTop || scrollTop <= 50) {
            promptSummarySection.classList.remove("minimized");
          }
        }
        lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;
      },
      false
    );
  }

  // --- NEW: Back Arrow Navigation (for dashboard.html) ---
  const backArrowElement = document.querySelector(".back-arrow");

  if (backArrowElement) {
    backArrowElement.addEventListener("click", () => {
      window.location.href = "index.html";
    });
  }
  // --- End of NEW: Back Arrow Navigation ---


  // --- NEW: Chat Bar Scroll Behavior ---
  const chatInputBar = document.querySelector(".chat-input-bar-section");
  if (chatInputBar) {
    let lastScrollTop = 0;
    const scrollThreshold = 5; // Small threshold to avoid toggling on minor scrolls

    window.addEventListener("scroll", () => {
      let scrollTop = window.pageYOffset || document.documentElement.scrollTop;

      if (Math.abs(lastScrollTop - scrollTop) <= scrollThreshold) {
        return;
      }

      if (scrollTop <= 0) { // Always show at the top of the page
        chatInputBar.classList.remove('chat-bar-hidden');
      } else if (scrollTop < lastScrollTop) { // Scrolling UP
        chatInputBar.classList.add('chat-bar-hidden');
      } else if (scrollTop > lastScrollTop) { // Scrolling DOWN
        chatInputBar.classList.remove('chat-bar-hidden');
      }
      lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;
    }, false);
  }
  // --- End of NEW: Chat Bar Scroll Behavior ---
});