(function() {
  /**
	 * @param {Object}
	 *            editor
	 * @param {string}
	 *            dialogType
	 * @return {?}
	 */
  var imageDialog = function(editor, dialogType) {
    /**
	 * @return {undefined}
	 */
    function commitContent() {
      /** @type {Arguments} */
      var args = arguments;
      var inlineStyleField = this.getContentElement("advanced", "txtdlgGenStyle");
      if (inlineStyleField) {
        inlineStyleField.commit.apply(inlineStyleField, args);
      }
      this.foreach(function(widget) {
        if (widget.commit) {
          if ("txtdlgGenStyle" != widget.id) {
            widget.commit.apply(widget, args);
          }
        }
      });
    }
    /**
	 * @param {Array}
	 *            targetFields
	 * @return {undefined}
	 */
    function commitInternally(targetFields) {
      if (!s) {
        /** @type {number} */
        s = 1;
        var dialog = this.getDialog();
        var activeClassName = dialog.imageElement;
        if (activeClassName) {
          this.commit(cycle, activeClassName);
          /** @type {Array} */
          targetFields = [].concat(targetFields);
          /** @type {number} */
          var valuesLen = targetFields.length;
          var field;
          /** @type {number} */
          var i = 0;
          for (;i < valuesLen;i++) {
            if (field = dialog.getContentElement.apply(dialog, targetFields[i].split(":"))) {
              field.setup(cycle, activeClassName);
            }
          }
        }
        /** @type {number} */
        s = 0;
      }
    }
    /** @type {number} */
    var cycle = 1;
    /** @type {RegExp} */
    var rxhtmlTag = /^\s*(\d+)((px)|\%)?\s*$/i;
    /** @type {RegExp} */
    var regexp = /(^\s*(\d+)((px)|\%)?\s*$)|^$/i;
    /** @type {RegExp} */
    var core_rnotwhite = /^\d+px$/;
    /**
	 * @return {undefined}
	 */
    var onSizeChange = function() {
      var value = this.getValue();
      var dialog = this.getDialog();
      var oImageOriginal = value.match(rxhtmlTag);
      if (oImageOriginal) {
        if ("%" == oImageOriginal[2]) {
          switchLockRatio(dialog, false);
        }
        value = oImageOriginal[1];
      }
      if (dialog.lockRatio) {
        oImageOriginal = dialog.originalElement;
        if ("true" == oImageOriginal.getCustomData("isReady")) {
          if ("txtHeight" == this.id) {
            if (value) {
              if ("0" != value) {
                /** @type {number} */
                value = Math.round(oImageOriginal.$.width * (value / oImageOriginal.$.height));
              }
            }
            if (!isNaN(value)) {
              dialog.setValueOf("info", "txtWidth", value);
            }
          } else {
            if (value) {
              if ("0" != value) {
                /** @type {number} */
                value = Math.round(oImageOriginal.$.height * (value / oImageOriginal.$.width));
              }
            }
            if (!isNaN(value)) {
              dialog.setValueOf("info", "txtHeight", value);
            }
          }
        }
      }
      updatePreview(dialog);
    };
    /**
	 * @param {?}
	 *            dialog
	 * @return {?}
	 */
    var updatePreview = function(dialog) {
      if (!dialog.originalElement || !dialog.preview) {
        return 1;
      }
      dialog.commitContent(4, dialog.preview);
      return 0;
    };
    var s;
    /**
	 * @param {?}
	 *            dialog
	 * @param {boolean}
	 *            recurring
	 * @return {?}
	 */
    var switchLockRatio = function(dialog, recurring) {
      if (!dialog.getContentElement("info", "ratioLock")) {
        return null;
      }
      var g = dialog.originalElement;
      if (!g) {
        return null;
      }
      if ("check" == recurring) {
        if (!dialog.userlockRatio && "true" == g.getCustomData("isReady")) {
          var ratioButton = dialog.getValueOf("info", "txtWidth");
          var height = dialog.getValueOf("info", "txtHeight");
          /** @type {number} */
          g = 1E3 * g.$.width / g.$.height;
          /** @type {number} */
          var b = 1E3 * ratioButton / height;
          /** @type {boolean} */
          dialog.lockRatio = false;
          if (!ratioButton && !height) {
            /** @type {boolean} */
            dialog.lockRatio = true;
          } else {
            if (!isNaN(g)) {
              if (!isNaN(b)) {
                if (Math.round(g) == Math.round(b)) {
                  /** @type {boolean} */
                  dialog.lockRatio = true;
                }
              }
            }
          }
        }
      } else {
        if (void 0 != recurring) {
          /** @type {boolean} */
          dialog.lockRatio = recurring;
        } else {
          /** @type {number} */
          dialog.userlockRatio = 1;
          /** @type {boolean} */
          dialog.lockRatio = !dialog.lockRatio;
        }
      }
      ratioButton = CKEDITOR.document.getById(btnLockSizesId);
      if (dialog.lockRatio) {
        ratioButton.removeClass("cke_btn_unlocked");
      } else {
        ratioButton.addClass("cke_btn_unlocked");
      }
      ratioButton.setAttribute("aria-checked", dialog.lockRatio);
      if (CKEDITOR.env.hc) {
        ratioButton.getChild(0).setHtml(dialog.lockRatio ? CKEDITOR.env.ie ? "\u25a0" : "\u25a3" : CKEDITOR.env.ie ? "\u25a1" : "\u25a2");
      }
      return dialog.lockRatio;
    };
    /**
	 * @param {?}
	 *            dialog
	 * @return {undefined}
	 */
    var resetSize = function(dialog) {
      var oImageOriginal = dialog.originalElement;
      if ("true" == oImageOriginal.getCustomData("isReady")) {
        var widthField = dialog.getContentElement("info", "txtWidth");
        var heightField = dialog.getContentElement("info", "txtHeight");
        if (widthField) {
          widthField.setValue(oImageOriginal.$.width);
        }
        if (heightField) {
          heightField.setValue(oImageOriginal.$.height);
        }
      }
      updatePreview(dialog);
    };
    /**
	 * @param {number}
	 *            type
	 * @param {Element}
	 *            element
	 * @return {undefined}
	 */
    var setupDimension = function(type, element) {
      /**
		 * @param {string}
		 *            elem
		 * @param {string}
		 *            value
		 * @return {?}
		 */
      function checkDimension(elem, value) {
        var iterator = elem.match(rxhtmlTag);
        return iterator ? ("%" == iterator[2] && (iterator[1] += "%", switchLockRatio(dialog, false)), iterator[1]) : value;
      }
      if (type == cycle) {
        var dialog = this.getDialog();
        /** @type {string} */
        var value = "";
        /** @type {string} */
        var dimension = "txtWidth" == this.id ? "width" : "height";
        var size = element.getAttribute(dimension);
        if (size) {
          value = checkDimension(size, value);
        }
        value = checkDimension(element.getStyle(dimension), value);
        this.setValue(value);
      }
    };
    var previewPreloader;
    /**
	 * @return {undefined}
	 */
    var onImgLoadEvent = function() {
      var original = this.originalElement;
      var content = CKEDITOR.document.getById(imagePreviewLoaderId);
      original.setCustomData("isReady", "true");
      original.removeListener("load", onImgLoadEvent);
      original.removeListener("error", onImgLoadErrorEvent);
      original.removeListener("abort", onImgLoadErrorEvent);
      if (content) {
        content.setStyle("display", "none");
      }
      if (!this.dontResetSize) {
        resetSize(this);
      }
      if (this.firstLoad) {
        CKEDITOR.tools.setTimeout(function() {
          switchLockRatio(this, "check");
        }, 0, this);
      }
      /** @type {boolean} */
      this.dontResetSize = this.firstLoad = false;
    };
    /**
	 * @return {undefined}
	 */
    var onImgLoadErrorEvent = function() {
      var original = this.originalElement;
      var content = CKEDITOR.document.getById(imagePreviewLoaderId);
      original.removeListener("load", onImgLoadEvent);
      original.removeListener("error", onImgLoadErrorEvent);
      original.removeListener("abort", onImgLoadErrorEvent);
      original = CKEDITOR.getUrl(CKEDITOR.plugins.get("image").path + "images/noimage.png");
      if (this.preview) {
        this.preview.setAttribute("src", original);
      }
      if (content) {
        content.setStyle("display", "none");
      }
      switchLockRatio(this, false);
    };
    /**
	 * @param {string}
	 *            id
	 * @return {?}
	 */
    var numbering = function(id) {
      return CKEDITOR.tools.getNextId() + "_" + id;
    };
    var btnLockSizesId = numbering("btnLockSizes");
    var btnResetSizeId = numbering("btnResetSize");
    var imagePreviewLoaderId = numbering("ImagePreviewLoader");
    var previewLinkId = numbering("previewLink");
    var previewImageId = numbering("previewImage");
    return{
      title : editor.lang.image["image" == dialogType ? "title" : "titleButton"],
      minWidth : 420,
      minHeight : 360,
      /**
		 * @return {undefined}
		 */
      onShow : function() {
        /** @type {boolean} */
        this.linkEditMode = this.imageEditMode = this.linkElement = this.imageElement = false;
        /** @type {boolean} */
        this.lockRatio = true;
        /** @type {number} */
        this.userlockRatio = 0;
        /** @type {boolean} */
        this.dontResetSize = false;
        /** @type {boolean} */
        this.firstLoad = true;
        /** @type {boolean} */
        this.addLink = false;
        var editor = this.getParentEditor();
        var element = editor.getSelection();
        var link = (element = element && element.getSelectedElement()) && editor.elementPath(element).contains("a", 1);
        var list = CKEDITOR.document.getById(imagePreviewLoaderId);
        if (list) {
          list.setStyle("display", "none");
        }
        previewPreloader = new CKEDITOR.dom.element("img", editor.document);
        this.preview = CKEDITOR.document.getById(previewImageId);
        this.originalElement = editor.document.createElement("img");
        this.originalElement.setAttribute("alt", "");
        this.originalElement.setCustomData("isReady", "false");
        if (link) {
          this.linkElement = link;
          /** @type {boolean} */
          this.linkEditMode = true;
          list = link.getChildren();
          if (1 == list.count()) {
            var no = list.getItem(0).getName();
            if ("img" == no || "input" == no) {
              this.imageElement = list.getItem(0);
              if ("img" == this.imageElement.getName()) {
                /** @type {string} */
                this.imageEditMode = "img";
              } else {
                if ("input" == this.imageElement.getName()) {
                  /** @type {string} */
                  this.imageEditMode = "input";
                }
              }
            }
          }
          if ("image" == dialogType) {
            this.setupContent(2, link);
          }
        }
        if (this.customImageElement) {
          /** @type {string} */
          this.imageEditMode = "img";
          this.imageElement = this.customImageElement;
          delete this.customImageElement;
        } else {
          if (element && ("img" == element.getName() && !element.data("cke-realelement")) || element && ("input" == element.getName() && "image" == element.getAttribute("type"))) {
            this.imageEditMode = element.getName();
            this.imageElement = element;
          }
        }
        if (this.imageEditMode) {
          this.cleanImageElement = this.imageElement;
          this.imageElement = this.cleanImageElement.clone(true, true);
          this.setupContent(cycle, this.imageElement);
        } else {
          this.imageElement = editor.document.createElement("img");
        }
        switchLockRatio(this, true);
        if (!CKEDITOR.tools.trim(this.getValueOf("info", "txtUrl"))) {
          this.preview.removeAttribute("src");
          this.preview.setStyle("display", "none");
        }
      },
      /**
		 * @return {undefined}
		 */
      onOk : function() {
        if (this.imageEditMode) {
          var now = this.imageEditMode;
          if ("image" == dialogType && ("input" == now && confirm(editor.lang.image.button2Img))) {
            this.imageElement = editor.document.createElement("img");
            this.imageElement.setAttribute("alt", "");
            editor.insertElement(this.imageElement);
          } else {
            if ("image" != dialogType && ("img" == now && confirm(editor.lang.image.img2Button))) {
              this.imageElement = editor.document.createElement("input");
              this.imageElement.setAttributes({
                type : "image",
                alt : ""
              });
              editor.insertElement(this.imageElement);
            } else {
              this.imageElement = this.cleanImageElement;
              delete this.cleanImageElement;
            }
          }
        } else {
          if ("image" == dialogType) {
            this.imageElement = editor.document.createElement("img");
          } else {
            this.imageElement = editor.document.createElement("input");
            this.imageElement.setAttribute("type", "image");
          }
          this.imageElement.setAttribute("alt", "");
        }
        if (!this.linkEditMode) {
          this.linkElement = editor.document.createElement("a");
        }
        this.commitContent(cycle, this.imageElement);
        this.commitContent(2, this.linkElement);
        if (!this.imageElement.getAttribute("style")) {
          this.imageElement.removeAttribute("style");
        }
        if (this.imageEditMode) {
          if (!this.linkEditMode && this.addLink) {
            editor.insertElement(this.linkElement);
            this.imageElement.appendTo(this.linkElement);
          } else {
            if (this.linkEditMode) {
              if (!this.addLink) {
                editor.getSelection().selectElement(this.linkElement);
                editor.insertElement(this.imageElement);
              }
            }
          }
        } else {
          if (this.addLink) {
            if (this.linkEditMode) {
              editor.insertElement(this.imageElement);
            } else {
              editor.insertElement(this.linkElement);
              this.linkElement.append(this.imageElement, false);
            }
          } else {
            editor.insertElement(this.imageElement);
          }
        }
      },
      /**
		 * @return {undefined}
		 */
      onLoad : function() {
        if ("image" != dialogType) {
          this.hidePage("Link");
        }
        var doc = this._.element.getDocument();
        if (this.getContentElement("info", "ratioLock")) {
          this.addFocusable(doc.getById(btnResetSizeId), 5);
          this.addFocusable(doc.getById(btnLockSizesId), 5);
        }
        /** @type {function (): undefined} */
        this.commitContent = commitContent;
      },
      /**
		 * @return {undefined}
		 */
      onHide : function() {
        if (this.preview) {
          this.commitContent(8, this.preview);
        }
        if (this.originalElement) {
          this.originalElement.removeListener("load", onImgLoadEvent);
          this.originalElement.removeListener("error", onImgLoadErrorEvent);
          this.originalElement.removeListener("abort", onImgLoadErrorEvent);
          this.originalElement.remove();
          /** @type {boolean} */
          this.originalElement = false;
        }
        delete this.imageElement;
      },
      contents : [{
        id : "info",
        label : editor.lang.image.infoTab,
        accessKey : "I",
        elements : [{
          type : "vbox",
          padding : 0,
          children : [{
            type : "hbox",
            widths : ["280px", "110px"],
            align : "right",
            children : [{
              id : "txtUrl",
              type : "text",
              label : editor.lang.common.url,
              required : true,
              /**
				 * @return {undefined}
				 */
              onChange : function() {
                var dialog = this.getDialog();
                var newUrl = this.getValue();
                if (newUrl.indexOf("/nddk-portlet") > -1) {
                	newUrl = newUrl.replace("/nddk-portlet", "");
                    this.setValue(newUrl);
                }
                if (0 < newUrl.length) {
                  dialog = this.getDialog();
                  var original = dialog.originalElement;
                  if (dialog.preview) {
                    dialog.preview.removeStyle("display");
                  }
                  original.setCustomData("isReady", "false");
                  var loader = CKEDITOR.document.getById(imagePreviewLoaderId);
                  if (loader) {
                    loader.setStyle("display", "");
                  }
                  original.on("load", onImgLoadEvent, dialog);
                  original.on("error", onImgLoadErrorEvent, dialog);
                  original.on("abort", onImgLoadErrorEvent, dialog);
                  original.setAttribute("src", newUrl);
                  if (dialog.preview) {
                    previewPreloader.setAttribute("src", newUrl);
                    dialog.preview.setAttribute("src", previewPreloader.$.src);
                    updatePreview(dialog);
                  }
                } else {
                  if (dialog.preview) {
                    dialog.preview.removeAttribute("src");
                    dialog.preview.setStyle("display", "none");
                  }
                }
              },
              /**
				 * @param {number}
				 *            type
				 * @param {Node}
				 *            element
				 * @return {undefined}
				 */
              setup : function(type, element) {
                if (type == cycle) {
                  var initialValue = element.data("cke-saved-src") || element.getAttribute("src");
                  /** @type {boolean} */
                  this.getDialog().dontResetSize = true;
                  this.setValue(initialValue);
                  this.setInitValue();
                }
              },
              /**
				 * @param {number}
				 *            type
				 * @param {Element}
				 *            element
				 * @return {undefined}
				 */
              commit : function(type, element) {
                if (type == cycle && (this.getValue() || this.isChanged())) {
                  element.data("cke-saved-src", this.getValue());
                  element.setAttribute("src", this.getValue());
                } else {
                  if (8 == type) {
                    element.setAttribute("src", "");
                    element.removeAttribute("src");
                  }
                }
              },
              validate : CKEDITOR.dialog.validate.notEmpty(editor.lang.image.urlMissing)
            }, {
              type : "button",
              id : "browse",
              style : "display:inline-block;margin-top:14px;",
              align : "center",
              label : editor.lang.common.browseServer,
              hidden : true,
              filebrowser : "info:txtUrl"
            }]
          }]
        }, {
          id : "txtAlt",
          type : "text",
          label : editor.lang.image.alt,
          accessKey : "T",
          "default" : "",
          /**
			 * @return {undefined}
			 */
          onChange : function() {
            updatePreview(this.getDialog());
          },
          /**
			 * @param {number}
			 *            type
			 * @param {Element}
			 *            element
			 * @return {undefined}
			 */
          setup : function(type, element) {
            if (type == cycle) {
              this.setValue(element.getAttribute("alt"));
            }
          },
          /**
			 * @param {number}
			 *            type
			 * @param {Element}
			 *            element
			 * @return {undefined}
			 */
          commit : function(type, element) {
            if (type == cycle) {
              if (this.getValue() || this.isChanged()) {
                element.setAttribute("alt", this.getValue());
              }
            } else {
              if (4 == type) {
                element.setAttribute("alt", this.getValue());
              } else {
                if (8 == type) {
                  element.removeAttribute("alt");
                }
              }
            }
          }
        }, {
          type : "hbox",
          children : [{
            id : "basic",
            type : "vbox",
            children : [{
              type : "hbox",
              requiredContent : "img{width,height}",
              widths : ["50%", "50%"],
              children : [{
                type : "vbox",
                padding : 1,
                children : [{
                  type : "text",
                  width : "45px",
                  id : "txtWidth",
                  label : editor.lang.common.width,
                  /** @type {function (): undefined} */
                  onKeyUp : onSizeChange,
                  /**
					 * @return {undefined}
					 */
                  onChange : function() {
                    commitInternally.call(this, "advanced:txtdlgGenStyle");
                  },
                  /**
					 * @return {?}
					 */
                  validate : function() {
                    var result = this.getValue().match(regexp);
                    if (!(result = !!(result && 0 !== parseInt(result[1], 10)))) {
                      alert(editor.lang.common.invalidWidth);
                    }
                    return result;
                  },
                  /** @type {function (number, Element): undefined} */
                  setup : setupDimension,
                  /**
					 * @param {number}
					 *            type
					 * @param {Element}
					 *            element
					 * @param {?}
					 *            html
					 * @return {undefined}
					 */
                  commit : function(type, element, html) {
                    var value = this.getValue();
                    if (type == cycle) {
                      if (value && editor.activeFilter.check("img{width,height}")) {
                        element.setStyle("width", CKEDITOR.tools.cssLength(value));
                      } else {
                        element.removeStyle("width");
                      }
                      if (!html) {
                        element.removeAttribute("width");
                      }
                    } else {
                      if (4 == type) {
                        if (value.match(rxhtmlTag)) {
                          element.setStyle("width", CKEDITOR.tools.cssLength(value));
                        } else {
                          type = this.getDialog().originalElement;
                          if ("true" == type.getCustomData("isReady")) {
                            element.setStyle("width", type.$.width + "px");
                          }
                        }
                      } else {
                        if (8 == type) {
                          element.removeAttribute("width");
                          element.removeStyle("width");
                        }
                      }
                    }
                  }
                }, {
                  type : "text",
                  id : "txtHeight",
                  width : "45px",
                  label : editor.lang.common.height,
                  /** @type {function (): undefined} */
                  onKeyUp : onSizeChange,
                  /**
					 * @return {undefined}
					 */
                  onChange : function() {
                    commitInternally.call(this, "advanced:txtdlgGenStyle");
                  },
                  /**
					 * @return {?}
					 */
                  validate : function() {
                    var result = this.getValue().match(regexp);
                    if (!(result = !!(result && 0 !== parseInt(result[1], 10)))) {
                      alert(editor.lang.common.invalidHeight);
                    }
                    return result;
                  },
                  /** @type {function (number, Element): undefined} */
                  setup : setupDimension,
                  /**
					 * @param {number}
					 *            type
					 * @param {Element}
					 *            element
					 * @param {?}
					 *            html
					 * @return {undefined}
					 */
                  commit : function(type, element, html) {
                    var value = this.getValue();
                    if (type == cycle) {
                      if (value && editor.activeFilter.check("img{width,height}")) {
                        element.setStyle("height", CKEDITOR.tools.cssLength(value));
                      } else {
                        element.removeStyle("height");
                      }
                      if (!html) {
                        element.removeAttribute("height");
                      }
                    } else {
                      if (4 == type) {
                        if (value.match(rxhtmlTag)) {
                          element.setStyle("height", CKEDITOR.tools.cssLength(value));
                        } else {
                          type = this.getDialog().originalElement;
                          if ("true" == type.getCustomData("isReady")) {
                            element.setStyle("height", type.$.height + "px");
                          }
                        }
                      } else {
                        if (8 == type) {
                          element.removeAttribute("height");
                          element.removeStyle("height");
                        }
                      }
                    }
                  }
                }]
              }, {
                id : "ratioLock",
                type : "html",
                style : "margin-top:30px;width:40px;height:40px;",
                /**
				 * @return {undefined}
				 */
                onLoad : function() {
                  var resetButton = CKEDITOR.document.getById(btnResetSizeId);
                  var ratioButton = CKEDITOR.document.getById(btnLockSizesId);
                  if (resetButton) {
                    resetButton.on("click", function(evt) {
                      resetSize(this);
                      if (evt.data) {
                        evt.data.preventDefault();
                      }
                    }, this.getDialog());
                    resetButton.on("mouseover", function() {
                      this.addClass("cke_btn_over");
                    }, resetButton);
                    resetButton.on("mouseout", function() {
                      this.removeClass("cke_btn_over");
                    }, resetButton);
                  }
                  if (ratioButton) {
                    ratioButton.on("click", function(evt) {
                      switchLockRatio(this);
                      var n = this.originalElement;
                      var width = this.getValueOf("info", "txtWidth");
                      if (n.getCustomData("isReady") == "true" && width) {
                        /** @type {number} */
                        n = n.$.height / n.$.width * width;
                        if (!isNaN(n)) {
                          this.setValueOf("info", "txtHeight", Math.round(n));
                          updatePreview(this);
                        }
                      }
                      if (evt.data) {
                        evt.data.preventDefault();
                      }
                    }, this.getDialog());
                    ratioButton.on("mouseover", function() {
                      this.addClass("cke_btn_over");
                    }, ratioButton);
                    ratioButton.on("mouseout", function() {
                      this.removeClass("cke_btn_over");
                    }, ratioButton);
                  }
                },
                html : '<div><a href="javascript:void(0)" tabindex="-1" title="' + editor.lang.image.lockRatio + '" class="cke_btn_locked" id="' + btnLockSizesId + '" role="checkbox"><span class="cke_icon"></span><span class="cke_label">' + editor.lang.image.lockRatio + '</span></a><a href="javascript:void(0)" tabindex="-1" title="' + editor.lang.image.resetSize + '" class="cke_btn_reset" id="' + btnResetSizeId + '" role="button"><span class="cke_label">' + editor.lang.image.resetSize + "</span></a></div>"
              }]
            }, {
              type : "vbox",
              padding : 1,
              children : [{
                type : "text",
                id : "txtBorder",
                requiredContent : "img{border-width}",
                width : "60px",
                label : editor.lang.image.border,
                "default" : "",
                /**
				 * @return {undefined}
				 */
                onKeyUp : function() {
                  updatePreview(this.getDialog());
                },
                /**
				 * @return {undefined}
				 */
                onChange : function() {
                  commitInternally.call(this, "advanced:txtdlgGenStyle");
                },
                validate : CKEDITOR.dialog.validate.integer(editor.lang.image.validateBorder),
                /**
				 * @param {number}
				 *            type
				 * @param {Element}
				 *            element
				 * @return {undefined}
				 */
                setup : function(type, element) {
                  if (type == cycle) {
                    var value;
                    value = (value = (value = element.getStyle("border-width")) && value.match(/^(\d+px)(?: \1 \1 \1)?$/)) && parseInt(value[1], 10);
                    if (isNaN(parseInt(value, 10))) {
                      value = element.getAttribute("border");
                    }
                    this.setValue(value);
                  }
                },
                /**
				 * @param {number}
				 *            type
				 * @param {Element}
				 *            element
				 * @param {?}
				 *            html
				 * @return {undefined}
				 */
                commit : function(type, element, html) {
                  /** @type {number} */
                  var value = parseInt(this.getValue(), 10);
                  if (type == cycle || 4 == type) {
                    if (isNaN(value)) {
                      if (!value) {
                        if (this.isChanged()) {
                          element.removeStyle("border");
                        }
                      }
                    } else {
                      element.setStyle("border-width", CKEDITOR.tools.cssLength(value));
                      element.setStyle("border-style", "solid");
                    }
                    if (!html) {
                      if (type == cycle) {
                        element.removeAttribute("border");
                      }
                    }
                  } else {
                    if (8 == type) {
                      element.removeAttribute("border");
                      element.removeStyle("border-width");
                      element.removeStyle("border-style");
                      element.removeStyle("border-color");
                    }
                  }
                }
              }, {
                type : "text",
                id : "txtHSpace",
                requiredContent : "img{margin-left,margin-right}",
                width : "60px",
                label : editor.lang.image.hSpace,
                "default" : "",
                /**
				 * @return {undefined}
				 */
                onKeyUp : function() {
                  updatePreview(this.getDialog());
                },
                /**
				 * @return {undefined}
				 */
                onChange : function() {
                  commitInternally.call(this, "advanced:txtdlgGenStyle");
                },
                validate : CKEDITOR.dialog.validate.integer(editor.lang.image.validateHSpace),
                /**
				 * @param {number}
				 *            type
				 * @param {Element}
				 *            element
				 * @return {undefined}
				 */
                setup : function(type, element) {
                  if (type == cycle) {
                    var value;
                    var object;
                    value = element.getStyle("margin-left");
                    object = element.getStyle("margin-right");
                    value = value && value.match(core_rnotwhite);
                    object = object && object.match(core_rnotwhite);
                    /** @type {number} */
                    value = parseInt(value, 10);
                    /** @type {number} */
                    object = parseInt(object, 10);
                    /** @type {(boolean|number)} */
                    value = value == object && value;
                    if (isNaN(parseInt(value, 10))) {
                      value = element.getAttribute("hspace");
                    }
                    this.setValue(value);
                  }
                },
                /**
				 * @param {number}
				 *            type
				 * @param {Element}
				 *            element
				 * @param {?}
				 *            html
				 * @return {undefined}
				 */
                commit : function(type, element, html) {
                  /** @type {number} */
                  var value = parseInt(this.getValue(), 10);
                  if (type == cycle || 4 == type) {
                    if (isNaN(value)) {
                      if (!value) {
                        if (this.isChanged()) {
                          element.removeStyle("margin-left");
                          element.removeStyle("margin-right");
                        }
                      }
                    } else {
                      element.setStyle("margin-left", CKEDITOR.tools.cssLength(value));
                      element.setStyle("margin-right", CKEDITOR.tools.cssLength(value));
                    }
                    if (!html) {
                      if (type == cycle) {
                        element.removeAttribute("hspace");
                      }
                    }
                  } else {
                    if (8 == type) {
                      element.removeAttribute("hspace");
                      element.removeStyle("margin-left");
                      element.removeStyle("margin-right");
                    }
                  }
                }
              }, {
                type : "text",
                id : "txtVSpace",
                requiredContent : "img{margin-top,margin-bottom}",
                width : "60px",
                label : editor.lang.image.vSpace,
                "default" : "",
                /**
				 * @return {undefined}
				 */
                onKeyUp : function() {
                  updatePreview(this.getDialog());
                },
                /**
				 * @return {undefined}
				 */
                onChange : function() {
                  commitInternally.call(this, "advanced:txtdlgGenStyle");
                },
                validate : CKEDITOR.dialog.validate.integer(editor.lang.image.validateVSpace),
                /**
				 * @param {number}
				 *            type
				 * @param {Element}
				 *            element
				 * @return {undefined}
				 */
                setup : function(type, element) {
                  if (type == cycle) {
                    var value;
                    var object;
                    value = element.getStyle("margin-top");
                    object = element.getStyle("margin-bottom");
                    value = value && value.match(core_rnotwhite);
                    object = object && object.match(core_rnotwhite);
                    /** @type {number} */
                    value = parseInt(value, 10);
                    /** @type {number} */
                    object = parseInt(object, 10);
                    /** @type {(boolean|number)} */
                    value = value == object && value;
                    if (isNaN(parseInt(value, 10))) {
                      value = element.getAttribute("vspace");
                    }
                    this.setValue(value);
                  }
                },
                /**
				 * @param {number}
				 *            type
				 * @param {Element}
				 *            element
				 * @param {?}
				 *            html
				 * @return {undefined}
				 */
                commit : function(type, element, html) {
                  /** @type {number} */
                  var value = parseInt(this.getValue(), 10);
                  if (type == cycle || 4 == type) {
                    if (isNaN(value)) {
                      if (!value) {
                        if (this.isChanged()) {
                          element.removeStyle("margin-top");
                          element.removeStyle("margin-bottom");
                        }
                      }
                    } else {
                      element.setStyle("margin-top", CKEDITOR.tools.cssLength(value));
                      element.setStyle("margin-bottom", CKEDITOR.tools.cssLength(value));
                    }
                    if (!html) {
                      if (type == cycle) {
                        element.removeAttribute("vspace");
                      }
                    }
                  } else {
                    if (8 == type) {
                      element.removeAttribute("vspace");
                      element.removeStyle("margin-top");
                      element.removeStyle("margin-bottom");
                    }
                  }
                }
              }, {
                id : "cmbAlign",
                requiredContent : "img{float}",
                type : "select",
                widths : ["35%", "65%"],
                style : "width:90px",
                label : editor.lang.common.align,
                "default" : "",
                items : [[editor.lang.common.notSet, ""], [editor.lang.common.alignLeft, "left"], [editor.lang.common.alignRight, "right"]],
                /**
				 * @return {undefined}
				 */
                onChange : function() {
                  updatePreview(this.getDialog());
                  commitInternally.call(this, "advanced:txtdlgGenStyle");
                },
                /**
				 * @param {number}
				 *            type
				 * @param {Element}
				 *            element
				 * @return {undefined}
				 */
                setup : function(type, element) {
                  if (type == cycle) {
                    var value = element.getStyle("float");
                    switch(value) {
                      case "inherit":
                      ;
                      case "none":
                        /** @type {string} */
                        value = "";
                    }
                    if (!value) {
                      value = (element.getAttribute("align") || "").toLowerCase();
                    }
                    this.setValue(value);
                  }
                },
                /**
				 * @param {number}
				 *            type
				 * @param {Element}
				 *            element
				 * @param {?}
				 *            internalCommit
				 * @return {undefined}
				 */
                commit : function(type, element, internalCommit) {
                  var value = this.getValue();
                  if (type == cycle || 4 == type) {
                    if (value ? element.setStyle("float", value) : element.removeStyle("float"), !internalCommit && type == cycle) {
                      switch(value = (element.getAttribute("align") || "").toLowerCase(), value) {
                        case "left":
                        ;
                        case "right":
                          element.removeAttribute("align");
                      }
                    }
                  } else {
                    if (8 == type) {
                      element.removeStyle("float");
                    }
                  }
                }
              }]
            }]
          }, {
            type : "vbox",
            height : "250px",
            children : [{
              type : "html",
              id : "htmlPreview",
              style : "width:95%;",
              html : "<div>" + CKEDITOR.tools.htmlEncode(editor.lang.common.preview) + '<br><div id="' + imagePreviewLoaderId + '" class="ImagePreviewLoader" style="display:none"><div class="loading">&nbsp;</div></div><div class="ImagePreviewBox"><table><tr><td><a href="javascript:void(0)" target="_blank" onclick="return false;" id="' + previewLinkId + '"><img id="' + previewImageId + '" alt="" /></a>' + (editor.config.image_previewText || "Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Maecenas feugiat consequat diam. Maecenas metus. Vivamus diam purus, cursus a, commodo non, facilisis vitae, nulla. Aenean dictum lacinia tortor. Nunc iaculis, nibh non iaculis aliquam, orci felis euismod neque, sed ornare massa mauris sed velit. Nulla pretium mi et risus. Fusce mi pede, tempor id, cursus ac, ullamcorper nec, enim. Sed tortor. Curabitur molestie. Duis velit augue, condimentum at, ultrices a, luctus ut, orci. Donec pellentesque egestas eros. Integer cursus, augue in cursus faucibus, eros pede bibendum sem, in tempus tellus justo quis ligula. Etiam eget tortor. Vestibulum rutrum, est ut placerat elementum, lectus nisl aliquam velit, tempor aliquam eros nunc nonummy metus. In eros metus, gravida a, gravida sed, lobortis id, turpis. Ut ultrices, ipsum at venenatis fringilla, sem nulla lacinia tellus, eget aliquet turpis mauris non enim. Nam turpis. Suspendisse lacinia. Curabitur ac tortor ut ipsum egestas elementum. Nunc imperdiet gravida mauris.") + 
              "</td></tr></table></div></div>"
            }]
          }]
        }]
      }, {
        id : "Link",
        requiredContent : "a[href]",
        label : editor.lang.image.linkTab,
        padding : 0,
        elements : [{
          id : "txtUrl",
          type : "text",
          label : editor.lang.common.url,
          style : "width: 100%",
          "default" : "",
          /**
			 * @param {number}
			 *            type
			 * @param {Node}
			 *            element
			 * @return {undefined}
			 */
          setup : function(type, element) {
            if (2 == type) {
              var href = element.data("cke-saved-href");
              if (!href) {
                href = element.getAttribute("href");
              }
              this.setValue(href);
            }
          },
          /**
			 * @param {number}
			 *            type
			 * @param {HTMLElement}
			 *            element
			 * @return {undefined}
			 */
          commit : function(type, element) {
            if (2 == type && (this.getValue() || this.isChanged())) {
              var url = this.getValue();
              element.data("cke-saved-href", url);
              element.setAttribute("href", url);
              if (this.getValue() || !editor.config.image_removeLinkByEmptyURL) {
                /** @type {boolean} */
                this.getDialog().addLink = true;
              }
            }
          }
        }, {
          type : "button",
          id : "browse",
          filebrowser : {
            action : "Browse",
            target : "Link:txtUrl",
            url : editor.config.filebrowserImageBrowseLinkUrl
          },
          style : "float:right",
          hidden : true,
          label : editor.lang.common.browseServer
        }, {
          id : "cmbTarget",
          type : "select",
          requiredContent : "a[target]",
          label : editor.lang.common.target,
          "default" : "",
          items : [[editor.lang.common.notSet, ""], [editor.lang.common.targetNew, "_blank"], [editor.lang.common.targetTop, "_top"], [editor.lang.common.targetSelf, "_self"], [editor.lang.common.targetParent, "_parent"]],
          /**
			 * @param {number}
			 *            type
			 * @param {Element}
			 *            element
			 * @return {undefined}
			 */
          setup : function(type, element) {
            if (2 == type) {
              this.setValue(element.getAttribute("target") || "");
            }
          },
          /**
			 * @param {number}
			 *            type
			 * @param {Element}
			 *            element
			 * @return {undefined}
			 */
          commit : function(type, element) {
            if (2 == type) {
              if (this.getValue() || this.isChanged()) {
                element.setAttribute("target", this.getValue());
              }
            }
          }
        }]
      }, {
        id : "Upload",
        hidden : true,
        filebrowser : "uploadButton",
        label : editor.lang.image.upload,
        elements : [{
          type : "file",
          id : "upload",
          label : editor.lang.image.btnUpload,
          style : "height:40px",
          size : 38
        }, {
          type : "fileButton",
          id : "uploadButton",
          filebrowser : "info:txtUrl",
          label : editor.lang.image.btnUpload,
          "for" : ["Upload", "upload"]
        }]
      }, {
        id : "advanced",
        label : editor.lang.common.advancedTab,
        elements : [{
          type : "hbox",
          widths : ["50%", "25%", "25%"],
          children : [{
            type : "text",
            id : "linkId",
            requiredContent : "img[id]",
            label : editor.lang.common.id,
            /**
			 * @param {number}
			 *            type
			 * @param {Element}
			 *            element
			 * @return {undefined}
			 */
            setup : function(type, element) {
              if (type == cycle) {
                this.setValue(element.getAttribute("id"));
              }
            },
            /**
			 * @param {number}
			 *            type
			 * @param {Element}
			 *            element
			 * @return {undefined}
			 */
            commit : function(type, element) {
              if (type == cycle) {
                if (this.getValue() || this.isChanged()) {
                  element.setAttribute("id", this.getValue());
                }
              }
            }
          }, {
            id : "cmbLangDir",
            type : "select",
            requiredContent : "img[dir]",
            style : "width : 100px;",
            label : editor.lang.common.langDir,
            "default" : "",
            items : [[editor.lang.common.notSet, ""], [editor.lang.common.langDirLtr, "ltr"], [editor.lang.common.langDirRtl, "rtl"]],
            /**
			 * @param {number}
			 *            type
			 * @param {Element}
			 *            element
			 * @return {undefined}
			 */
            setup : function(type, element) {
              if (type == cycle) {
                this.setValue(element.getAttribute("dir"));
              }
            },
            /**
			 * @param {number}
			 *            type
			 * @param {Element}
			 *            element
			 * @return {undefined}
			 */
            commit : function(type, element) {
              if (type == cycle) {
                if (this.getValue() || this.isChanged()) {
                  element.setAttribute("dir", this.getValue());
                }
              }
            }
          }, {
            type : "text",
            id : "txtLangCode",
            requiredContent : "img[lang]",
            label : editor.lang.common.langCode,
            "default" : "",
            /**
			 * @param {number}
			 *            type
			 * @param {Element}
			 *            element
			 * @return {undefined}
			 */
            setup : function(type, element) {
              if (type == cycle) {
                this.setValue(element.getAttribute("lang"));
              }
            },
            /**
			 * @param {number}
			 *            type
			 * @param {Element}
			 *            element
			 * @return {undefined}
			 */
            commit : function(type, element) {
              if (type == cycle) {
                if (this.getValue() || this.isChanged()) {
                  element.setAttribute("lang", this.getValue());
                }
              }
            }
          }]
        }, {
          type : "text",
          id : "txtGenLongDescr",
          requiredContent : "img[longdesc]",
          label : editor.lang.common.longDescr,
          /**
			 * @param {number}
			 *            type
			 * @param {Element}
			 *            element
			 * @return {undefined}
			 */
          setup : function(type, element) {
            if (type == cycle) {
              this.setValue(element.getAttribute("longDesc"));
            }
          },
          /**
			 * @param {number}
			 *            type
			 * @param {Element}
			 *            element
			 * @return {undefined}
			 */
          commit : function(type, element) {
            if (type == cycle) {
              if (this.getValue() || this.isChanged()) {
                element.setAttribute("longDesc", this.getValue());
              }
            }
          }
        }, {
          type : "hbox",
          widths : ["50%", "50%"],
          children : [{
            type : "text",
            id : "txtGenClass",
            requiredContent : "img(cke-xyz)",
            label : editor.lang.common.cssClass,
            "default" : "",
            /**
			 * @param {number}
			 *            type
			 * @param {Element}
			 *            element
			 * @return {undefined}
			 */
            setup : function(type, element) {
              if (type == cycle) {
                this.setValue(element.getAttribute("class"));
              }
            },
            /**
			 * @param {number}
			 *            type
			 * @param {Element}
			 *            element
			 * @return {undefined}
			 */
            commit : function(type, element) {
              if (type == cycle) {
                if (this.getValue() || this.isChanged()) {
                  element.setAttribute("class", this.getValue());
                }
              }
            }
          }, {
            type : "text",
            id : "txtGenTitle",
            requiredContent : "img[title]",
            label : editor.lang.common.advisoryTitle,
            "default" : "",
            /**
			 * @return {undefined}
			 */
            onChange : function() {
              updatePreview(this.getDialog());
            },
            /**
			 * @param {number}
			 *            type
			 * @param {Element}
			 *            element
			 * @return {undefined}
			 */
            setup : function(type, element) {
              if (type == cycle) {
                this.setValue(element.getAttribute("title"));
              }
            },
            /**
			 * @param {number}
			 *            type
			 * @param {Element}
			 *            element
			 * @return {undefined}
			 */
            commit : function(type, element) {
              if (type == cycle) {
                if (this.getValue() || this.isChanged()) {
                  element.setAttribute("title", this.getValue());
                }
              } else {
                if (4 == type) {
                  element.setAttribute("title", this.getValue());
                } else {
                  if (8 == type) {
                    element.removeAttribute("title");
                  }
                }
              }
            }
          }]
        }, {
          type : "text",
          id : "txtdlgGenStyle",
          requiredContent : "img{cke-xyz}",
          label : editor.lang.common.cssStyle,
          validate : CKEDITOR.dialog.validate.inlineStyle(editor.lang.common.invalidInlineStyle),
          "default" : "",
          /**
			 * @param {number}
			 *            type
			 * @param {Object}
			 *            element
			 * @return {undefined}
			 */
          setup : function(type, element) {
            if (type == cycle) {
              var value = element.getAttribute("style");
              if (!value) {
                if (element.$.style.cssText) {
                  value = element.$.style.cssText;
                }
              }
              this.setValue(value);
              var height = element.$.style.height;
              value = element.$.style.width;
              height = (height ? height : "").match(rxhtmlTag);
              value = (value ? value : "").match(rxhtmlTag);
              this.attributesInStyle = {
                height : !!height,
                width : !!value
              };
            }
          },
          /**
			 * @return {undefined}
			 */
          onChange : function() {
            commitInternally.call(this, "info:cmbFloat info:cmbAlign info:txtVSpace info:txtHSpace info:txtBorder info:txtWidth info:txtHeight".split(" "));
            updatePreview(this);
          },
          /**
			 * @param {number}
			 *            type
			 * @param {Element}
			 *            element
			 * @return {undefined}
			 */
          commit : function(type, element) {
            if (type == cycle) {
              if (this.getValue() || this.isChanged()) {
                element.setAttribute("style", this.getValue());
              }
            }
          }
        }]
      }]
    };
  };
  CKEDITOR.dialog.add("image", function(editor) {
    return imageDialog(editor, "image");
  });
  CKEDITOR.dialog.add("imagebutton", function(editor) {
    return imageDialog(editor, "imagebutton");
  });
})();
