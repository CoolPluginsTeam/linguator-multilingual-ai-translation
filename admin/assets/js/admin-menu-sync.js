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
      this.bindEvents();
      this.createDialog();
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
        '<button type="button" class="button lmat-select-all">' +
        lmatMenuSync.strings.selectAll +
        "</button>" +
        '<button type="button" class="button lmat-deselect-all">' +
        lmatMenuSync.strings.deselectAll +
        "</button>" +
        "</div>" +
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

    /**
     * Populate languages list
     */
    populateLanguages: function () {
      var $container = $("#lmat-sync-dialog .lmat-sync-languages");
      var html = "";

      $.each(lmatMenuSync.languages, function (index, lang) {
        // Skip default language
        if (lang.is_default) {
          return;
        }

        html +=
          '<label class="lmat-lang-option">' +
          '<input type="checkbox" name="target_langs[]" value="' +
          lang.slug +
          '">' +
          "<span>" +
          lang.name +
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

      // Select all
      $(document).on("click", ".lmat-select-all", function () {
        $('#lmat-sync-dialog input[type="checkbox"]').prop("checked", true);
      });

      // Deselect all
      $(document).on("click", ".lmat-deselect-all", function () {
        $('#lmat-sync-dialog input[type="checkbox"]').prop("checked", false);
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
    },

    /**
     * Show dialog
     */
    showDialog: function (e) {
      e.preventDefault();

      // Reset checkboxes
      $('#lmat-sync-dialog input[type="checkbox"]').prop("checked", false);

      // Show dialog
      $("#lmat-sync-dialog").fadeIn(200);
    },

    /**
     * Hide dialog
     */
    hideDialog: function () {
      $("#lmat-sync-dialog").fadeOut(200);
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
        alert(lmatMenuSync.strings.noLanguages);
        return;
      }

      // Confirm replacement
      if (!confirm(lmatMenuSync.strings.confirmReplace)) {
        return;
      }

      // Show loading
      $(".lmat-sync-spinner").addClass("is-active");
      $(".lmat-sync-confirm").prop("disabled", true);
      $btn.prop("disabled", true);
      $btn.next(".spinner").addClass("is-active");

      // AJAX request
      $.ajax({
        url: lmatMenuSync.ajaxUrl,
        type: "POST",
        data: {
          action: "lmat_sync_menu",
          nonce: lmatMenuSync.nonce,
          menu_id: menuId,
          target_langs: selectedLangs,
        },
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
            self.showResult(
              "error",
              response.data.message || lmatMenuSync.strings.error
            );
          }
        },
        error: function () {
          self.showResult("error", lmatMenuSync.strings.error);
        },
        complete: function () {
          $(".lmat-sync-spinner").removeClass("is-active");
          $(".lmat-sync-confirm").prop("disabled", false);
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
