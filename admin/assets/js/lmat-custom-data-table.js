class BlockFilterSorter {
  constructor() {
    this.tableBody = document.querySelector('.lmat-custom-data-table-table tbody');
    this.filters = document.querySelectorAll('.lmat-custom-data-table-filters .lmat-filter-tab');
    this.lmatDataTableObj = null;
    this.saveButtonEnabled = false;
    this.saveButtonText = false;
    this.saveButtonClass = false;
    this.saveButtonAction = false;
    this.saveButtonNonce = false;
    this.displayAjaxNotice=false;
    this.ajaxUrl = false;

    if (window.lmatCustomTableDataObject) {
      if (lmatCustomTableDataObject.save_button_enabled && '' !== lmatCustomTableDataObject.save_button_enabled) {
        this.saveButtonEnabled = lmatCustomTableDataObject.save_button_enabled;
      }
      if (lmatCustomTableDataObject.save_button_text && '' !== lmatCustomTableDataObject.save_button_text) {
        this.saveButtonText = lmatCustomTableDataObject.save_button_text;
      }
      if (lmatCustomTableDataObject.save_button_class && '' !== lmatCustomTableDataObject.save_button_class) {
        this.saveButtonClass = lmatCustomTableDataObject.save_button_class;
      }
      if (lmatCustomTableDataObject.save_button_handler && '' !== lmatCustomTableDataObject.save_button_handler) {
        this.saveButtonAction = lmatCustomTableDataObject.save_button_handler;
      }
      if (lmatCustomTableDataObject.save_button_nonce && '' !== lmatCustomTableDataObject.save_button_nonce) {
        this.saveButtonNonce = lmatCustomTableDataObject.save_button_nonce;
      }
      if (lmatCustomTableDataObject.admin_url && '' !== lmatCustomTableDataObject.admin_url) {
        this.ajaxUrl = lmatCustomTableDataObject.admin_url;
      }

      const inputFields = document.querySelectorAll('#lmat-custom-datatable tbody input[name="lmat_fields_status"]');
      inputFields.forEach(input => {
        input.addEventListener('change', this.updateStatusHandler.bind(this));
      });
    }

    if (this.tableBody) {
      this.lmatDataTable();

      this.filters.forEach(filter => {
        filter.addEventListener('input', this.datatableFilterHandler.bind(this));
      });
    }
  }

  lmatDataTable() {
    if (this.tableBody) {
      this.lmatDataTableObj = new DataTable('#lmat-custom-datatable', {
        pageLength: 25,
        infoCallback: function (settings, start, end, total, max) {
          return `Showing ${start} to ${end} of ${max} records`;
        }
      });

      this.lmatDataTableObj.on('draw.dt', function (e) {
        const rows = jQuery(this).find('tbody tr');

        if (rows.length.length === 0) {
          this.lmatDataTableObj.empty();
        }

        const length = e.dt.page.info().length;
        const page = e.dt.page.info().page;

        rows.each(function (index, row) {
          const emptyCell = row.querySelector('td.dt-empty');
          if (!emptyCell) {
            row.children[0].textContent = (page * length) + index + 1;
          }
        });
      });

      const tableWrp = document.getElementById('lmat-custom-datatable_wrapper');
      const selectWrapper = document.querySelector('.lmat-custom-data-table-filters');
      selectWrapper.remove();
      tableWrp.prepend(selectWrapper);

      if (this.saveButtonEnabled && '' !== this.saveButtonText && 'false' !== this.saveButtonText) {
        const saveButton = this.appendSaveButton();
        const lastRow = tableWrp.querySelector('.dt-layout-row:last-child');
        lastRow.before(saveButton);

        jQuery(`.${this.saveButtonClass}`).on('click', this.saveButtonHandler.bind(this));
      }
    }
  }

  datatableFilterHandler(e) {
    if (this.lmatDataTableObj) {
      let value = e.target.value;
      let wrapper = e.target.closest('.lmat-filter-tab');
      let column = parseInt(wrapper.dataset.column);
      let defaultValue = wrapper.dataset.default;
      value = value === defaultValue ? false : value;
      this.lmatDataTableObj.column(column).search(value ? new RegExp('^' + value, 'i') : '', false, false, false).draw();
    }
  }

  updateStatusHandler(e) {
    const table = jQuery('#lmat-custom-datatable').DataTable();

    if (!table) return; // DataTable not initialized
  
    const $tr = jQuery(e.target).closest('tr');
    if (!$tr.length) return; // no row found
  
    const dtRow = table.row($tr);
    if (!dtRow.node()) return; // row doesn’t exist in DataTable
  
    const checked = e.target.checked;
    const status = checked ? 'Supported' : 'Unsupported';
  
    // Make sure cell exists
    const cell = dtRow.cell(dtRow.index(), 3);
    if (!cell) return;
  
    // Update via DataTables API
    cell.data(status);
  }

  saveButtonHandler(e) {
    e.preventDefault();
    const saveBtns = jQuery(`.${this.saveButtonClass}`);

    if (saveBtns.hasClass('saving')) {
      return;
    }

    if (!this.saveButtonAction || '' === this.saveButtonAction || !this.saveButtonNonce || '' === this.saveButtonNonce || !this.ajaxUrl || '' === this.ajaxUrl) {
      return;
    }

    const selectedCheckbox = [];
    const tdNodes = this.lmatDataTableObj.column(4).nodes();

    if (tdNodes.length > 0) {
      Array.from(tdNodes).forEach(tdNode => {
        const checkbox = tdNode.querySelector('input[type="checkbox"]');
        if (checkbox && checkbox.checked) {
          selectedCheckbox.push(checkbox.value);
        }
      });
    }

    if (selectedCheckbox.length === 0) {
      return;
    }

    const apiSendData = {
      action: this.saveButtonAction,
      lmat_nonce: this.saveButtonNonce,
      save_custom_fields_data: JSON.stringify(selectedCheckbox)
    };

    saveBtns.addClass('saving').html('<span class="saving-text">Saving<span class="dot" style="--i:0"></span><span class="dot" style="--i:1"></span><span class="dot" style="--i:2"></span></span>', true);

    fetch(this.ajaxUrl, {
      method: 'POST',
      headers: {
        'content-type': 'application/x-www-form-urlencoded; charset=UTF-8',
        'Accept': 'application/json',
      },
      body: new URLSearchParams(apiSendData)
    })
      .then(response => response.json())
      .then(data => {
        saveBtns.removeClass('saving').html(this.saveButtonText, true);

        if (data.success) {
          if (data.data.message) {
            this.appendMessageNotice(data.data.message, 'success');
          }
        }
      })
      .catch(error => {
        console.log(error);
        if (error.data.message) {
          this.appendMessageNotice(data.data.message, 'error');
        }
        saveBtns.removeClass('saving').html(this.saveButtonText, true);
        console.error(error);
      });
  }

  appendMessageNotice(message, type) {

    if(this.displayAjaxNotice){
      jQuery('#lmat-custom-fields-message-notice').remove();
      clearTimeout(this.displayAjaxNotice);
    }

    this.displayAjaxNotice=setTimeout(() => {
      this.displayAjaxNotice=false;
      jQuery('#lmat-custom-fields-message-notice').remove();
    }, 10000);

    let messageNotice = jQuery('<div id="lmat-custom-fields-message-notice" style="margin-bottom: 10px;"><p>' + message + '</p></div>');
    messageNotice.addClass('is-dismissible notice notice-' + type);
    jQuery('#lmat-settings-header').after(messageNotice);
  }

  appendSaveButton() {

    if (!this.saveButtonText || '' === this.saveButtonText || 'false' === this.saveButtonText || !this.saveButtonEnabled) {
      return;
    }

    const saveButton = document.createElement('button');
    saveButton.className = 'button button-primary ' + this.saveButtonClass;
    saveButton.textContent = this.saveButtonText;
    return saveButton;
  }
}

// Call the class after window load
window.addEventListener('load', () => {
  new BlockFilterSorter();
});