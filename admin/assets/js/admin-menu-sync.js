/**
 * Menu Sync JavaScript
 *
 * Handles the menu sync dialog and AJAX communication
 */

(function ($) {
  "use strict";

  var lmatMenuSyncDialog = {
    /**
     * Initialize
     */
    init: function () {
      this.addSyncButton();
      this.bindEvents();
      this.createDialog();
    },

    /**
     * Add Sync Menu button next to Save Menu button
     */
    addSyncButton: function () {
      var $saveButton = $("#save_menu_header");
      
      if (!$saveButton.length) {
        console.warn("Save Menu button not found");
        return;
      }
      
      if (!lmatMenuSync.menuId) {
        console.warn("Menu ID not available:", lmatMenuSync.menuId);
        return;
      }
      
      
      var $syncButton = $(
        '<button type="button" id="lmat-sync-menu-btn" class="button button-secondary" style="margin-left: 10px;">' +
          lmatMenuSync.strings.syncButton +
          "</button>"
      );

      // Add data attributes
      $syncButton.data("menu-id", lmatMenuSync.menuId);
      $syncButton.data("menu-lang", lmatMenuSync.menuLang);

      // Add button after Save Menu button
      $saveButton.after($syncButton);

      // Add result container below the buttons
      var $resultContainer = $(
        '<div id="lmat-sync-result" style="display:none; margin-top: 15px; clear: both;"></div>'
      );
      $("#nav-menu-header").after($resultContainer);
      
    },

    /**
     * Bind events
     */
    bindEvents: function () {
      $(document).on(
        "click",
        "#lmat-sync-menu-btn",
        this.showDialog.bind(this)
      );
    },

    /**
     * Create dialog HTML
     */
    createDialog: function () {
      var dialogHTML =
        '<div id="lmat-sync-dialog" style="display:none;">' +
        '<div class="lmat-sync-overlay"></div>' +
        '<div class="lmat-sync-modal">' +
        '<div class="lmat-sync-header">' +
        "<h2>" +
        lmatMenuSync.strings.selectLanguages +
        "</h2>" +
        '<button type="button" class="lmat-sync-close">&times;</button>' +
        "</div>" +
        '<div class="lmat-sync-body">' +
        '<div class="lmat-sync-actions">' +
        '<button type="button" class="button lmat-toggle-all">' +
        lmatMenuSync.strings.selectAll +
        "</button>" +
        "</div>" +
        '<div class="lmat-sync-error" style="display:none;"></div>' +
        '<div class="lmat-sync-languages"></div>' +
        "</div>" +
        '<div class="lmat-sync-footer">' +
        '<button type="button" class="button button-primary lmat-sync-confirm">' +
        lmatMenuSync.strings.sync +
        "</button>" +
        '<button type="button" class="button lmat-sync-cancel">' +
        lmatMenuSync.strings.cancel +
        "</button>" +
        '<span class="lmat-sync-spinner spinner"></span>' +
        "</div>" +
        "</div>" +
        "</div>";

      $("body").append(dialogHTML);

      // Populate languages
      this.populateLanguages();

      // Bind dialog events
      this.bindDialogEvents();
    },

    populateLanguages: function () {
      var $container = $("#lmat-sync-dialog .lmat-sync-languages");
      var html = "";

      // Get current menu's language from the button data attribute
      var currentMenuLang = $("#lmat-sync-menu-btn").data("menu-lang");

      $.each(lmatMenuSync.languages, function (index, lang) {
        // Skip the language that the current menu is already assigned to
        if (lang.slug === currentMenuLang) {
          return;
        }

        // Add warning icon if menu already exists
        var warningIcon = "";
        if (lang.has_synced_menu) {
          warningIcon =
            '<span class="lmat-warning-icon" title="A synced menu already exists for this language and will be replaced">⚠️</span>';
        }

        // Display format: "English - en_US" or "Hindi - hi_IN"
        var displayName = lang.name;
        if (lang.locale) {
          displayName = lang.name + " - " + lang.locale;
        }

        html +=
          '<label class="lmat-lang-option' +
          (lang.has_synced_menu ? " has-existing-menu" : "") +
          '">' +
          '<input type="checkbox" name="target_langs[]" value="' +
          lang.slug +
          '">' +
          "<span>" +
          displayName +
          warningIcon +
          "</span>" +
          "</label>";
      });

      $container.html(html);
    },

    /**
     * Bind dialog events
     */
    bindDialogEvents: function () {
      var self = this;

      // Close dialog
      $(document).on(
        "click",
        ".lmat-sync-close, .lmat-sync-cancel, .lmat-sync-overlay",
        function () {
          self.hideDialog();
        }
      );

      // Toggle select/unselect all
      $(document).on("click", ".lmat-toggle-all", function () {
        var $button = $(this);
        var $checkboxes = $('#lmat-sync-dialog input[type="checkbox"]');
        var allChecked =
          $checkboxes.length === $checkboxes.filter(":checked").length;

        if (allChecked) {
          // Unselect all
          $checkboxes.prop("checked", false);
          $button.text(lmatMenuSync.strings.selectAll);
        } else {
          // Select all
          $checkboxes.prop("checked", true);
          $button.text(lmatMenuSync.strings.deselectAll);
        }
      });

      // Confirm sync
      $(document).on("click", ".lmat-sync-confirm", function () {
        self.performSync();
      });

      // ESC key to close
      $(document).on("keyup", function (e) {
        if (e.key === "Escape" && $("#lmat-sync-dialog").is(":visible")) {
          self.hideDialog();
        }
      });

      // Update button text when individual checkboxes are clicked
      $(document).on(
        "change",
        '#lmat-sync-dialog input[type="checkbox"]',
        function () {
          var $button = $(".lmat-toggle-all");
          var $checkboxes = $('#lmat-sync-dialog input[type="checkbox"]');
          var allChecked =
            $checkboxes.length === $checkboxes.filter(":checked").length;

          if (allChecked) {
            $button.text(lmatMenuSync.strings.deselectAll);
          } else {
            $button.text(lmatMenuSync.strings.selectAll);
          }
          
          // Hide error message when a language is selected
          if ($checkboxes.filter(":checked").length > 0) {
            $(".lmat-sync-error").slideUp(200);
          }
        }
      );
    },

    /**
     * Show sync dialog
     */
    showDialog: function (e) {
      e.preventDefault();

      var $button = $(e.currentTarget);
      var menuId = $button.data("menu-id");

      // Check if menu has items
      var menuItemsCount = $("#menu-to-edit li.menu-item").length;

      if (menuItemsCount === 0) {
        // Show error message if menu is empty
        this.showErrorDialog(
          lmatMenuSync.strings.emptyMenuError ||
            "The source menu is empty. Please add menu items before syncing."
        );
        return;
      }

      // Check if there are any languages available to sync
      var currentMenuLang = $button.data("menu-lang");
      var availableLanguages = 0;
      
      $.each(lmatMenuSync.languages, function (index, lang) {
        if (lang.slug !== currentMenuLang) {
          availableLanguages++;
        }
      });

      if (availableLanguages === 0) {
        // Show message if no languages available
        this.showErrorDialog(
          lmatMenuSync.strings.noTranslatedContent ||
            "No translated content is available for selected menu items. Please add and translate content in other languages first."
        );
        return;
      }

      // Reset checkboxes
      $('#lmat-sync-dialog input[type="checkbox"]').prop("checked", false);

      // Reset button text to "Select All"
      $(".lmat-toggle-all").text(lmatMenuSync.strings.selectAll);
      
      // Hide error message
      $(".lmat-sync-error").hide();

      // Regenerate language list to reflect current menu's synced languages
      this.populateLanguages();

      // Show dialog
      $("#lmat-sync-dialog").fadeIn(200);
    },

    /**
     * Show error dialog
     */
    showErrorDialog: function (message) {
      // Create error dialog if it doesn't exist
      if (!$("#lmat-error-dialog").length) {
        var errorDialogHTML =
          '<div id="lmat-error-dialog" style="display:none;">' +
          '<div class="lmat-sync-overlay"></div>' +
          '<div class="lmat-sync-modal" style="max-width: 500px;">' +
          '<div class="lmat-sync-header" style="justify-content: flex-end; padding: 8px 12px;">' +
          '<button type="button" class="lmat-error-close">&times;</button>' +
          "</div>" +
          '<div class="lmat-sync-body" style="padding: 0;">' +
          '<div class="lmat-error-message" style="padding: 20px; text-align: center;"></div>' +
          "</div>" +
          "</div>" +
          "</div>";

        $("body").append(errorDialogHTML);

        // Bind close events
        $(document).on(
          "click",
          ".lmat-error-close, #lmat-error-dialog .lmat-sync-overlay",
          function () {
            $("#lmat-error-dialog").fadeOut(200);
          }
        );

        // ESC key to close
        $(document).on("keyup", function (e) {
          if (e.key === "Escape" && $("#lmat-error-dialog").is(":visible")) {
            $("#lmat-error-dialog").fadeOut(200);
          }
        });
      }

      // Set message and show dialog
      $("#lmat-error-dialog .lmat-error-message").html(
        '<p style="margin: 0; font-size: 18px; line-height: 1.6; color: #d63638; font-weight: 500;">' + message + "</p>"
      );
      
      // Force close button styling
      $("#lmat-error-dialog .lmat-error-close").css({
        'background': 'none',
        'border': 'none',
        'font-size': '32px',
        'line-height': '1',
        'cursor': 'pointer',
        'color': '#50575e',
        'padding': '0',
        'width': '40px',
        'height': '40px',
        'display': 'flex',
        'align-items': 'center',
        'justify-content': 'center',
        'border-radius': '4px',
        'transition': 'color 0.2s ease',
        'font-weight': '300',
        'outline': 'none',
        'box-shadow': 'none',
        'margin': '0',
        'min-width': '40px',
        'min-height': '40px'
      }).hover(
        function() {
          $(this).css('color', '#000');
        },
        function() {
          $(this).css('color', '#50575e');
        }
      );
      
      $("#lmat-error-dialog").fadeIn(200);
    },

    /**
     * Hide dialog
     */
    hideDialog: function () {
      $("#lmat-sync-dialog").fadeOut(200);
      // Hide error message when dialog closes
      $(".lmat-sync-error").hide();
    },

    /**
     * Perform sync
     */
    performSync: function () {
      var self = this;
      var $btn = $("#lmat-sync-menu-btn");
      var menuId = $btn.data("menu-id");
      var selectedLangs = [];


      // Get selected languages
      $('#lmat-sync-dialog input[type="checkbox"]:checked').each(function () {
        selectedLangs.push($(this).val());
      });


      // Validate
      if (selectedLangs.length === 0) {
        $(".lmat-sync-error")
          .html(lmatMenuSync.strings.noLanguages)
          .slideDown(200);
        return;
      }
      
      // Hide error message if languages are selected
      $(".lmat-sync-error").slideUp(200);

      // Show loading
      $(".lmat-sync-spinner").addClass("is-active");
      var $confirmBtn = $(".lmat-sync-confirm");
      $confirmBtn.prop("disabled", true);
      $confirmBtn.data("original-text", $confirmBtn.text()); // Store original text
      $confirmBtn.text(lmatMenuSync.strings.syncing); // Change to "Syncing..."
      $btn.prop("disabled", true);
      $btn.next(".spinner").addClass("is-active");

      var ajaxData = {
        action: "lmat_sync_menu",
        nonce: lmatMenuSync.nonce,
        menu_id: menuId,
        target_langs: selectedLangs,
      };


      // AJAX request
      $.ajax({
        url: lmatMenuSync.ajaxUrl,
        type: "POST",
        data: ajaxData,
        success: function (response) {
          if (response.success) {
            self.showResult(
              "success",
              response.data.message,
              response.data.details
            );

            // Reload page after 2 seconds to show updated menus
            setTimeout(function () {
              window.location.reload();
            }, 2000);
          } else {
            // Log detailed error
            console.error("Sync failed:", response);
            
            // Handle specific error codes with appropriate messages
            var errorMsg = lmatMenuSync.strings.error;
            var errorCode = response.data && response.data.error_code;
            
            if (errorCode) {
              switch (errorCode) {
                case 'permission_denied':
                  errorMsg = lmatMenuSync.strings.permissionError || response.data.message;
                  break;
                case 'invalid_menu_id':
                case 'menu_not_found':
                  errorMsg = lmatMenuSync.strings.invalidMenuError || response.data.message;
                  break;
                case 'empty_menu':
                  errorMsg = lmatMenuSync.strings.emptyMenuError || response.data.message;
                  break;
                case 'no_translations':
                  errorMsg = lmatMenuSync.strings.noTranslationsError || response.data.message;
                  break;
                case 'no_languages_selected':
                  errorMsg = lmatMenuSync.strings.noLanguages || response.data.message;
                  break;
                default:
                  errorMsg = response.data.message || lmatMenuSync.strings.error;
              }
            } else if (response.data && response.data.message) {
              errorMsg = response.data.message;
            }
            
            self.showResult("error", errorMsg);
          }
        },
        error: function (xhr, status, error) {
          // Log detailed error
          console.error("AJAX error:", status, error, xhr);
          
          var errorMsg = lmatMenuSync.strings.error;
          
          // Handle specific HTTP status codes
          if (xhr.status === 403) {
            errorMsg = lmatMenuSync.strings.permissionError || "Permission denied.";
          } else if (xhr.status === 404) {
            errorMsg = "Server endpoint not found. Please refresh the page.";
          } else if (xhr.status === 500) {
            errorMsg = "Server error occurred. Please try again.";
          } else if (xhr.status === 0) {
            errorMsg = "Network error. Please check your internet connection.";
          } else if (xhr.responseJSON && xhr.responseJSON.data) {
            // Check for error code in response
            if (xhr.responseJSON.data.error_code) {
              var errorCode = xhr.responseJSON.data.error_code;
              errorMsg = xhr.responseJSON.data.message || lmatMenuSync.strings.error;
            } else if (xhr.responseJSON.data.message) {
              errorMsg = xhr.responseJSON.data.message;
            }
          } else if (error) {
            errorMsg += " (" + error + ")";
          }
          
          self.showResult("error", errorMsg);
        },
        complete: function () {
          $(".lmat-sync-spinner").removeClass("is-active");
          var $confirmBtn = $(".lmat-sync-confirm");
          $confirmBtn.prop("disabled", false);
          // Restore original button text
          var originalText = $confirmBtn.data("original-text");
          if (originalText) {
            $confirmBtn.text(originalText);
          }
          $btn.prop("disabled", false);
          $btn.next(".spinner").removeClass("is-active");
          self.hideDialog();
        },
      });
    },

    /**
     * Show result message
     */
    showResult: function (type, message, details) {
      var $result = $("#lmat-sync-result");
      var className = type === "success" ? "notice-success" : "notice-error";
      var html =
        '<div class="notice ' +
        className +
        ' is-dismissible"><p>' +
        message +
        "</p>";

      // Add details if available
      if (details) {
        html += '<ul style="margin-top: 10px;">';
        $.each(details, function (lang, data) {
          if (data.synced > 0) {
            html +=
              "<li><strong>" +
              lang +
              ":</strong> " +
              data.synced +
              " items synced, " +
              data.skipped +
              " items skipped</li>";
          }
        });
        html += "</ul>";
      }

      html += "</div>";

      $result.html(html).slideDown();

      // Auto-hide after 5 seconds
      setTimeout(function () {
        $result.slideUp();
      }, 5000);
    },
  };

  // Initialize on document ready
  $(document).ready(function () {
    lmatMenuSyncDialog.init();
  });
})(jQuery);
