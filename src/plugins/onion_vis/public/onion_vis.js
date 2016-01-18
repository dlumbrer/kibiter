define(function (require) {
  // we need to load the css ourselves
  require('plugins/onion_vis/onion_vis.less');

  // we also need to load the controller and used by the template
  require('plugins/onion_vis/onion_vis_controller');

  // register the provider with the visTypes registry so that other know it exists
  require('ui/registry/vis_types').register(OnionVisProvider);

  function OnionVisProvider(Private) {
    var TemplateVisType = Private(require('ui/template_vis_type/TemplateVisType'));
    var Schemas = Private(require('ui/Vis/Schemas'));

    // return the visType object, which kibana will use to display and configure new
    // Vis object of this type.
    return new TemplateVisType({
      name: 'onion',
      title: 'onion widget',
      icon: 'fa-code',
      description: 'onion demo plugin.',
      template: require('plugins/onion_vis/onion_vis.html'),
      params: {
        editor: require('plugins/onion_vis/onion_vis_params.html')
      },
      schemas: new Schemas([
        {
          group: 'metrics',
          name: 'metric',
          title: 'Metric',
          min: 1,
          defaults: [
            { type: 'count', schema: 'metric' }
          ]
        },
        {
          group: 'buckets',
          name: 'segment',
          title: 'Onion field',
          min: 1,
          max: 1,
          aggFilter: 'terms',
          params:[{
            name: 'size',
            default: 0
          }]
        }
      ])
    });
  }

  // export the provider so that the visType can be required with Private()
  return OnionVisProvider;
});
