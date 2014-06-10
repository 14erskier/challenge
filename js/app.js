// Model
App = Ember.Application.create();

App.Router.map(function() {
  this.resource('locations');
  this.resource('views', function() {
    this.resource('view', { path: ':view_title' });
    this.resource('add', {path: ':view_address'});
  });
});

App.ViewsRoute = Ember.Route.extend({
    model: function(){
      return sbux;
    },
});

App.AddController = Ember.ObjectController.extend({
    isAdding: true,

    actions: {
      createUser: function() {
        this.set('isAdding', true);
      },

      submit: function() {
        this.set('isAdding', false);
      }
    }
});

App.ViewController = Ember.ObjectController.extend({
    isEditing: false,

    actions: {

      edit: function() {
        this.set('isEditing', true);
      },

      doneEditing: function() {
        this.set('isEditing', false);
      },
    }
});

App.LocationsRoute = Ember.Route.extend({
  model: function(){
    return App.LocationsController;
  }
})

App.LocationsController = Ember.Controller.extend({
    //default zoom level
    zoomLevel: 13,
    map: null,
    zoomLevelChanged: function () {
        var zoomLevel = this.get('zoomLevel');
        var map = this.get('map');
        //Control not changing the zoom of the map if it is yet at the value
        if (zoomLevel != map.getZoom()) {
            map.setZoom(zoomLevel);
        }
    }.observes('zoomLevel'),
});

App.LocationsView = Ember.View.extend({
    templateName: 'locations',
    didInsertElement: function () {
        var center = [39.73154915,-104.9738003];
        var controller = this.get('controller');
        var zoomLevel = controller.get('zoomLevel');
        var map = L.map('map').setView(center, zoomLevel);
        L.tileLayer('https://{s}.tiles.mapbox.com/v3/examples.map-i87786ca/{z}/{x}/{y}.png', {
        attribution: '<a href="http://www.mapbox.com/about/maps/" target="_blank">Terms &amp; Feedback</a>'
    }).addTo(map);
        // load data layers and Pop-up 
        var sbuxPopup = L.geoJson(undefined, {
     style: function (feature) {
         return feature.properties.style;
     },
     onEachFeature: function (feature, layer) {
         layer.bindPopup('<b>'+"Location ID:"+'</b><br>'+feature.properties.title +'</br><br>' + feature.properties.address);
     }
 })
        sbuxPopup.addData(sbux);
        sbuxPopup.addTo(map);

      /*   L.geoJson(sbux, {
              onEachFeature: onEachFeature
         }).addTo(map);*/

        // Event listeners
        map.on('zoomend', function (e) {
            console.log('zoomend', 'Setting zoomLevel ' + e.target.getZoom());
            controller.set('zoomLevel', e.target.getZoom());
        });

        // save map instance
        this.controller.set('map', map);
    }
});

//Email Link
  Em.Handlebars.registerBoundHelper('mailTo', function (emailAddress, label) {
    emailAddress = Em.Handlebars.Utils.escapeExpression(emailAddress);
    label = (arguments.length == 2) ? emailAddress : Em.Handlebars.Utils.escapeExpression(label);

    var link = '<a href="mailto:' + emailAddress + '">' + label + '</a>';
    return new Em.Handlebars.SafeString(link);
});

App.EmailController = Ember.Controller.extend({
    changed: false,
    username: 'fpp',
    emailAddress: 'foo@foobar.com',

    init: function () {
        Ember.run.later(this, function () {
            this.set('emailAddress', 'foo@bar.com');
            this.set('username', 'BarFoo');
            this.set('changed', true);
        }, 3000);
    }
});

function submitInfo(){
    var newStore = Ember.Mixin.create({
      title: null,
      address: null,
      managerFirstname: null,
      managerLastname: null,
      email: null,

      init: function() {
        this._super();
        this.set("title", newStoreTitle);
        this.set("address", newStoreAddy);
        this.set("managerFirstname", newStoreFirst);
        this.set("managerLastname", newStoreLast);
        this.set("email", newStoreEmail);
      }
    });
    
    var newStoreTitle = sbux.push(document.getElementById("title").value);
    var newStoreAddy = sbux.push(document.getElementById("address").value);
    var newStoreFirst = sbux.push(document.getElementById("managerFirstname").value);
    var newStoreLast = sbux.push(document.getElementById("managerLastname").value);
    var newStoreEmail = sbux.push(document.getElementById("email").value);


    var element = document.getElementById("inputFields");

    for(var i = 0; i<sbux.length; i++){
        element.innerHTML += sbux[i]; // problem 2
    }

}
  
  starbucks = Ember.Object.extend({
    title: null,
    address: null,
    managerFirstname: null,
    managerLastname: null,
    email: null
  });
  
  sbux = [
  starbucks.create({
    "type": "Feature",
    "geometry": {
      "type": "Point",
      "coordinates": [-104.9880331,39.70963867]
    },
    "properties": {
      "title": "Starbucks #1",
      "address": "381 S Broadway",
      "managerFirstname":"Sara",
      "managerLastname":"Roberts",
      "email": "starbucks1@sbux.com",
      "marker-color": "#fc4353",
      "marker-size": "large",
      "marker-symbol": "monument",
      "popupContent": "Test"
    }
  }),
  starbucks.create({
    "type": "Feature",
    "geometry": {
      "type": "Point",
      "coordinates": [-104.9729565, 39.71135378]
    },
    "properties": {
      "title": "Starbucks #2",
      "address": "1209 E Alameda Ave",
      "managerFirstname":"Mike",
      "managerLastname":"Jones",
      "email": "starbucks2@sbux.com",
      "marker-color": "#fc4353",
      "marker-size": "large",
      "marker-symbol": "harbor"
    }
  }),
  starbucks.create({
    "type": "Feature",
    "geometry": {
      "type": "Point",
      "coordinates": [-104.9527596, 39.74054004]
    },
    "properties": {
      "title": "Starbucks #3",
      "address": "2975 E Colfax Ave",
      "managerFirstname":"Mary",
      "managerLastname":"Stevens",
      "email": "starbucks3@sbux.com",
      "marker-color": "#fc4353",
      "marker-size": "large",
      "marker-symbol": "harbor"
    }
  }),
  starbucks.create({
    "type": "Feature",
    "geometry": {
      "type": "Point",
      "coordinates": [-105.0011131, 39.73966236]
    },
    "properties": {
      "title": "Starbucks #4",
      "address": "1050 W Colfax Ave",
      "managerFirstname":"Jane",
      "managerLastname":"Williams",
      "email": "starbucks4@sbux.com",
      "marker-color": "#fc4353",
      "marker-size": "large",
      "marker-symbol": "harbor"
    }
  }),
  starbucks.create({
    "type": "Feature",
    "geometry": {
      "type": "Point",
      "coordinates": [-104.9738003, 39.73154915]
    },
    "properties": {
      "title": "Starbucks #5",
      "address": "1155 E 9th Ave",
      "managerFirstname":"Diane",
      "managerLastname":"Lee",
      "email": "starbucks5@sbux.com",
      "marker-color": "#fc4353",
      "marker-size": "large",
      "marker-symbol": "harbor"
    }
  })];