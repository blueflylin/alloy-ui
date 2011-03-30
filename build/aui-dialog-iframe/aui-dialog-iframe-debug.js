AUI.add('aui-dialog-iframe', function(A) {
var Lang = A.Lang,
	getClassName = A.ClassNameManager.getClassName,

	IFRAME = 'iframe',

	CSS_IFRAME_NODE = getClassName('dialog', IFRAME, 'node'),
	CSS_IFRAME_BD = getClassName('dialog', IFRAME, 'bd'),

	BUFFER_CSS_CLASS = [CSS_IFRAME_NODE],

	TPL_IFRAME = '<iframe class="{cssClass}" frameborder="0" id="{id}" name="{id}" src="{uri}"></iframe>',

	UI = A.Widget.UI_SRC,
	UI_SRC = {
		src: UI
	};

var DialogIframePlugin = A.Component.create(
	{
		ATTRS: {
			closeOnEscape: {
				value: true
			},

			iframeCssClass: {
				value: '',
				setter: '_setIframeCssClass'
			},

			iframeId: {
				valueFn: function() {
					var instance = this;

					return instance.get('id') || A.guid();
				}
			},

			uri: {
			}
		},

		EXTENDS: A.Plugin.Base,
		NAME: IFRAME,
		NS: IFRAME,
		prototype: {
			initializer: function(config) {
				var instance = this;

				instance._host = instance.get('host');

				instance.publish(
					'load',
					{
						defaultFn: instance._defaultLoadIframeFn
					}
				);

				instance.afterHostMethod('renderUI', instance.renderUI);
				instance.afterHostMethod('bindUI', instance.bindUI);

				instance.afterHostMethod('render', instance._afterRender);
			},

			renderUI: function() {
				var instance = this;

				instance._previousBodyContent = instance._host.get('bodyContent');

				var iframeTpl = Lang.sub(
					TPL_IFRAME,
					{
						cssClass: instance.get('iframeCssClass'),
						id: instance.get('iframeId'),
						uri: instance.get('uri')
					}
				);

				var node = A.Node.create(iframeTpl);

				instance._host.set('bodyContent', node);

				var bodyNode = instance._host.bodyNode;

				bodyNode.addClass(CSS_IFRAME_BD);

				instance._bodyNode = bodyNode;
				instance.node = node;
			},

			bindUI: function() {
				var instance = this;

				instance.afterHostEvent('heightChange', instance._updateIframeSize, instance);
				instance.afterHostEvent('widthChange', instance._updateIframeSize, instance);

				instance.after('uriChange', instance._afterUriChange);

				instance.node.on('load', A.bind(instance.fire, instance, 'load'));
			},

			destructor: function() {
				var instance = this;

				instance._host.set('bodyContent', instance._previousBodyContent);

				instance.node.remove(true);
			},

			_adjustSize: A.cached(
				function(number) {
					return ((parseInt(number, 10) || 0) - 5);
				}
			),

			_afterRender: function() {
				var instance = this;

				instance._bodyNode.plug(A.LoadingMask).loadingmask.show();
			},

			_afterUriChange: function(event) {
				var instance = this;

				if (event.src != UI) {
					instance._uiSetUri(event.newVal);
				}
			},

			_defaultLoadIframeFn: function(event) {
				var instance = this;

				var node = instance.node;

				try {
					var iframeDoc = node.get('contentWindow.document');

					iframeDoc.get('documentElement').setStyle('overflow', 'visible');

					var iframeBody = iframeDoc.get('body');

					node.set('height', iframeBody.get('scrollHeight') + 10);

					instance.set('uri', iframeDoc.get('location.href'), UI_SRC);

					if (instance.get('closeOnEscape')) {
						A.on(
							'key',
							function(event) {
								instance._host.close();
							},
							[iframeDoc],
							'down:27'
						);
					}
				}
				catch (e) {
				}

				instance._bodyNode.loadingmask.hide();
			},

			_setIframeCssClass: function(value) {
				BUFFER_CSS_CLASS[1] = value;

				return BUFFER_CSS_CLASS.join(' ');
			},

			_uiSetUri: function(value) {
				var instance = this;

				if (instance._bodyNode.loadingmask) {
					instance._bodyNode.loadingmask.show();
				}

				instance.node.attr('src', value);
			},

			_updateIframeSize: function(event) {
				var instance = this;

				var adjustSize = instance._adjustSize;

				var bodyNode = instance._bodyNode;
				var node = instance.node;

				var updateIframeSizeUI = instance._updateIframeSizeUI;

				if (!updateIframeSizeUI) {
					updateIframeSizeUI = function() {
						var bodyHeight = bodyNode.getStyle('height');

						node.setStyle('height', adjustSize(bodyHeight));

						bodyNode.loadingmask.refreshMask();
					};

					instance._updateIframeSizeUI = updateIframeSizeUI;
				}

				setTimeout(updateIframeSizeUI, 50);
			}
		}
	}
);

A.Plugin.DialogIframe = DialogIframePlugin;

}, '@VERSION@' ,{requires:['aui-base','aui-loading-mask','plugin'], skinnable:true});