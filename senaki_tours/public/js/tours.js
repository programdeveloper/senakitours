/* ===== Senaki Tourist Map — Main JS ===== */
(function () {
  "use strict";

  let map, markers = [], activeLayers = {}, allObjects = [], allCategories = [];
  let currentLang = "ka";
  let satelliteLayer, streetLayer, currentTile = "street";
  let routeLayers = [];   // array of active route polylines
  let userLocMarker = null;
  let userLocation = null; // {lat, lng} when GPS acquired
  let selectedObject = null;
  let navRouteActive = false; // true when detail-panel nav route is shown

  /* ---- INIT ---- */
  function init() {
    initMap();
    loadData();
    bindEvents();
    checkUrlParam();
    setTimeout(() => {
      document.querySelector(".map-loading")?.classList.add("hidden");
    }, 800);
  }

  /* ---- URL ?obj= param ---- */
  function checkUrlParam() {
    var params = new URLSearchParams(window.location.search);
    var objName = params.get("obj");
    if (objName) {
      // Wait for data to load, then open
      var tries = 0;
      var interval = setInterval(function () {
        tries++;
        if (allObjects.length > 0 || tries > 20) {
          clearInterval(interval);
          if (objName) window.__senakiOpenDetail(objName);
        }
      }, 200);
    }
  }

  /* ---- MAP SETUP ---- */
  function initMap() {
    map = L.map("tours-map", {
      center: [42.2697, 42.0697],
      zoom: 12,
      zoomControl: false,
      attributionControl: true,
      maxZoom: 18,
      minZoom: 8
    });

    streetLayer = L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: '&copy; <a href="https://osm.org/copyright">OpenStreetMap</a>'
    });

    satelliteLayer = L.tileLayer(
      "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}", {
      attribution: '&copy; Esri &mdash; Source: Esri, Maxar, Earthstar Geographics'
    });

    streetLayer.addTo(map);
  }

  /* ---- DATA ---- */
  function loadData() {
    // Try Frappe API first, fallback to embedded data
    if (typeof frappe !== "undefined" && frappe.call) {
      frappe.call({
        method: "senaki_tours.api.tourist.get_categories",
        async: true,
        callback: function (r) {
          allCategories = r.message || [];
          frappe.call({
            method: "senaki_tours.api.tourist.get_tourist_objects",
            async: true,
            callback: function (r2) {
              allObjects = r2.message || [];
              renderFilters();
              renderMarkers();
              renderLegend();
              populateRouteSelects();
            }
          });
        }
      });
    } else {
      // Fallback: use embedded data from Jinja
      allCategories = window.__SENAKI_CATEGORIES || [];
      allObjects = window.__SENAKI_OBJECTS || [];
      renderFilters();
      renderMarkers();
      renderLegend();
      populateRouteSelects();
    }
  }

  /* ---- FILTERS ---- */
  function renderFilters() {
    var list = document.getElementById("filter-list");
    if (!list) return;
    list.innerHTML = "";

    // "All" item
    var allItem = el("div", "filter-item active", { "data-cat": "all" });
    allItem.innerHTML =
      '<div class="filter-color-dot" style="background:var(--clr-primary-light)"></div>' +
      '<span class="filter-item-label">' + t("ყველა", "All") + '</span>' +
      '<span class="filter-item-count">' + allObjects.length + '</span>';
    allItem.onclick = function () { toggleFilter("all"); };
    list.appendChild(allItem);

    allCategories.forEach(function (cat) {
      var count = allObjects.filter(function (o) { return o.category === cat.name; }).length;
      var item = el("div", "filter-item active", { "data-cat": cat.name });
      item.innerHTML =
        '<div class="filter-color-dot" style="background:' + cat.color + '"></div>' +
        '<span class="filter-item-label">' + t(cat.category_name_ka, cat.category_name) + '</span>' +
        '<span class="filter-item-count">' + count + '</span>';
      item.onclick = function () { toggleFilter(cat.name); };
      list.appendChild(item);
      activeLayers[cat.name] = true;
    });
  }

  function toggleFilter(cat) {
    if (cat === "all") {
      var allActive = Object.values(activeLayers).every(function (v) { return v; });
      allCategories.forEach(function (c) { activeLayers[c.name] = !allActive; });
    } else {
      activeLayers[cat] = !activeLayers[cat];
    }
    updateFilterUI();
    renderMarkers();
  }

  function updateFilterUI() {
    document.querySelectorAll(".filter-item").forEach(function (el) {
      var cat = el.getAttribute("data-cat");
      if (cat === "all") {
        var allOn = Object.values(activeLayers).every(function (v) { return v; });
        el.classList.toggle("active", allOn);
      } else {
        el.classList.toggle("active", !!activeLayers[cat]);
      }
    });
  }

  /* ---- MARKERS ---- */
  function renderMarkers() {
    markers.forEach(function (m) { map.removeLayer(m); });
    markers = [];

    allObjects.forEach(function (obj) {
      if (!activeLayers[obj.category]) return;
      var color = obj.category_color || "#2E7D32";
      var icon = obj.category_icon || "📍";

      var markerIcon = L.divIcon({
        className: "custom-marker-wrapper",
        html: '<div class="custom-marker" style="background:' + color + '">' +
              '<span class="marker-inner">' + icon + '</span></div>',
        iconSize: [36, 36],
        iconAnchor: [18, 36],
        popupAnchor: [0, -36]
      });

      var marker = L.marker([obj.latitude, obj.longitude], { icon: markerIcon });

      // Popup
      var imgHtml = obj.image
        ? '<img class="popup-img" src="' + obj.image + '" alt="' + obj.title + '">'
        : '';
      var excerpt = stripHtml(obj.description || obj.description_ka || "").substring(0, 100);
      var popupHtml =
        '<div class="popup-content">' +
          imgHtml +
          '<div class="popup-body">' +
            '<div class="popup-title">' + t(obj.title_ka, obj.title) + '</div>' +
            '<span class="popup-cat" style="background:' + color + '">' +
              t(obj.category_name_ka, obj.category) + '</span>' +
            '<div class="popup-excerpt">' + excerpt + '...</div>' +
            '<button class="popup-btn" onclick="window.__senakiOpenDetail(\'' +
              obj.name + '\')">' + t("ვრცლად", "Details") + ' →</button>' +
          '</div>' +
        '</div>';

      marker.bindPopup(popupHtml, { maxWidth: 280, closeButton: true });
      marker.addTo(map);
      markers.push(marker);
    });
  }

  /* ---- DETAIL PANEL ---- */
  window.__senakiOpenDetail = function (name) {
    var obj = allObjects.find(function (o) { return o.name === name; });
    if (!obj) return;
    selectedObject = obj;
    map.closePopup();

    var panel = document.getElementById("detail-panel");
    var color = obj.category_color || "#2E7D32";

    // Image
    var imgEl = document.getElementById("detail-img");
    if (obj.image) {
      imgEl.src = obj.image;
      imgEl.style.display = "block";
    } else {
      imgEl.style.display = "none";
    }

    // Category badge
    var badge = document.getElementById("detail-badge");
    badge.textContent = t(obj.category_name_ka, obj.category);
    badge.style.background = color;

    // Title
    document.getElementById("detail-title").textContent = t(obj.title_ka, obj.title) || obj.title;
    document.getElementById("detail-title-sub").textContent =
      currentLang === "ka" ? (obj.title || "") : (obj.title_ka || "");

    // Meta
    setMeta("detail-address", obj.address, "📍");
    setMeta("detail-phone", obj.phone, "📞");
    setMeta("detail-hours", obj.working_hours, "🕐");
    setMeta("detail-web", obj.website, "🌐", true);

    // Description
    document.getElementById("detail-desc").innerHTML =
      t(obj.description_ka, obj.description) || t("აღწერა არ არის", "No description available");

    // Coordinates
    document.getElementById("detail-coords").textContent =
      obj.latitude.toFixed(6) + ", " + obj.longitude.toFixed(6);

    // Google Maps external link (secondary action)
    var gmapsBtn = document.getElementById("detail-gmaps");
    gmapsBtn.onclick = function () {
      window.open("https://www.google.com/maps?q=" + obj.latitude + "," + obj.longitude, "_blank");
    };

    // QR — encodes local tourist guide URL so scanning opens the app
    var qrImg = document.getElementById("detail-qr-img");
    var localUrl = window.location.origin + "/tours?obj=" + encodeURIComponent(obj.name);
    qrImg.src = "https://api.qrserver.com/v1/create-qr-code/?size=120x120&data=" +
      encodeURIComponent(localUrl);
    var qrLabel = document.querySelector(".detail-qr p");
    if (qrLabel) qrLabel.textContent = t("სკანირება — ობიექტის გახსნა", "Scan to open this location");

    // Navigate — in-app routing via OSRM
    var navBtn = document.getElementById("detail-navigate");
    console.log("Setting onclick for", obj.name);
    navBtn.onclick = function () { 
      console.log("Navigate clicked for", obj.name);
      navigateToObject(obj); 
    };

    // Fly to marker
    map.flyTo([obj.latitude, obj.longitude], 15, { duration: 1.2 });

    panel.classList.add("open");
  };

  function setMeta(id, value, icon, isLink) {
    var el = document.getElementById(id);
    if (!el) return;
    if (value) {
      el.style.display = "flex";
      var valEl = el.querySelector(".meta-value");
      if (isLink) {
        valEl.innerHTML = '<a href="' + value + '" target="_blank">' + value + '</a>';
      } else {
        valEl.textContent = value;
      }
    } else {
      el.style.display = "none";
    }
  }

  function closeDetail() {
    document.getElementById("detail-panel").classList.remove("open");
    selectedObject = null;
    clearRouteLayers();
    navRouteActive = false;
  }

  /* ---- OSRM ROUTING ---- */
  // Fetch a real road route from OSRM and return {coords, distance, duration}
  function osrmRoute(profile, fromLat, fromLng, toLat, toLng) {
    var url = "https://router.project-osrm.org/route/v1/" + profile + "/" +
      fromLng + "," + fromLat + ";" + toLng + "," + toLat +
      "?overview=full&geometries=geojson";
    return fetch(url).then(function (r) { return r.json(); }).then(function (data) {
      if (!data.routes || !data.routes[0]) throw new Error("No route");
      var route = data.routes[0];
      var coords = route.geometry.coordinates.map(function (c) { return [c[1], c[0]]; });
      return { coords: coords, distance: route.distance / 1000, duration: route.duration };
    });
  }

  function clearRouteLayers() {
    routeLayers.forEach(function (l) { map.removeLayer(l); });
    routeLayers = [];
  }

  // Draw a polyline, store it, return it
  function drawSegment(coords, color, dashed) {
    var opts = { color: color, weight: 5, opacity: 0.9 };
    if (dashed) opts.dashArray = "12 8";
    var poly = L.polyline(coords, opts).addTo(map);
    routeLayers.push(poly);
    return poly;
  }

  // Show route legend strip inside route panel or detail area
  function showRouteLegend(hasDrive, hasWalk) {
    var legend = document.getElementById("route-mode-legend");
    if (!legend) return;
    legend.innerHTML = "";
    if (hasDrive) legend.innerHTML += '<span class="rleg-item"><span class="rleg-dot" style="background:#2196F3"></span>' + t("მანქანა","Drive") + '</span>';
    if (hasWalk)  legend.innerHTML += '<span class="rleg-item"><span class="rleg-dot" style="background:#43A047"></span>' + t("ფეხით","Walk") + '</span>';
    legend.style.display = (hasDrive || hasWalk) ? "flex" : "none";
  }

  // Update route info card
  function updateRouteInfo(totalDist, driveSec, walkSec) {
    var infoEl = document.querySelector(".route-info");
    if (!infoEl) return;
    document.getElementById("route-distance").textContent = totalDist.toFixed(1) + " კმ";
    var driveEl = document.getElementById("route-drive-time");
    var walkEl  = document.getElementById("route-walk-time");
    if (driveEl) driveEl.textContent = driveSec > 0 ? Math.round(driveSec / 60) + " წთ" : "—";
    if (walkEl)  walkEl.textContent  = walkSec  > 0 ? Math.round(walkSec  / 60) + " წთ" : "—";
    infoEl.style.display = "flex";
  }

  // In-app navigate from detail panel (from GPS or last known loc to obj)
  function navigateToObject(toObj) {
    console.log("navigateToObject called", toObj);
    clearRouteLayers();
    if (navRouteActive) { navRouteActive = false; return; } // toggle off
    navRouteActive = true;

    function doRoute(fromLat, fromLng) {
      var routeType = toObj.route_type || "drive";
      var isMixed = routeType === "mixed" && toObj.walk_from_lat && toObj.walk_from_lng;
      if (isMixed) {
        // Segment 1: drive to trailhead
        osrmRoute("driving", fromLat, fromLng, toObj.walk_from_lat, toObj.walk_from_lng)
          .then(function (seg1) {
            drawSegment(seg1.coords, "#2196F3", false);
            // Segment 2: walk to destination
            return osrmRoute("foot", toObj.walk_from_lat, toObj.walk_from_lng, toObj.latitude, toObj.longitude)
              .then(function (seg2) {
                drawSegment(seg2.coords, "#43A047", true);
                var allCoords = seg1.coords.concat(seg2.coords);
                map.fitBounds(L.latLngBounds(allCoords), { padding: [60, 60] });
                updateRouteInfo(seg1.distance + seg2.distance, seg1.duration, seg2.duration);
                showRouteLegend(true, true);
              });
          }).catch(function () { fallbackLine(fromLat, fromLng, toObj, "mixed"); });
      } else {
        var profile = routeType === "walk" ? "foot" : "driving";
        var color   = routeType === "walk" ? "#43A047" : "#2196F3";
        osrmRoute(profile, fromLat, fromLng, toObj.latitude, toObj.longitude)
          .then(function (seg) {
            drawSegment(seg.coords, color, routeType === "walk");
            map.fitBounds(L.latLngBounds(seg.coords), { padding: [60, 60] });
            updateRouteInfo(seg.distance, routeType === "walk" ? 0 : seg.duration, routeType === "walk" ? seg.duration : 0);
            showRouteLegend(routeType !== "walk", routeType === "walk");
          }).catch(function () { fallbackLine(fromLat, fromLng, toObj, routeType); });
      }
    }

    if (userLocation) {
      doRoute(userLocation.lat, userLocation.lng);
    } else if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(function (pos) {
        userLocation = { lat: pos.coords.latitude, lng: pos.coords.longitude };
        placeUserMarker(userLocation.lat, userLocation.lng);
        doRoute(userLocation.lat, userLocation.lng);
      }, function () {
        alert(t("GPS მიუწვდომელია", "GPS unavailable. Please enable location."));
        navRouteActive = false;
      });
    } else {
      alert(t("GPS მიუწვდომელია", "GPS not supported by this browser."));
      navRouteActive = false;
    }
  }

  function fallbackLine(fromLat, fromLng, toObj, routeType) {
    var color = routeType === "walk" ? "#43A047" : "#2196F3";
    var poly = L.polyline([[fromLat, fromLng],[toObj.latitude, toObj.longitude]],
      { color: color, weight: 4, dashArray: "10 6", opacity: 0.8 }).addTo(map);
    routeLayers.push(poly);
    map.fitBounds(poly.getBounds(), { padding: [60, 60] });
  }

  function placeUserMarker(lat, lng) {
    if (userLocMarker) map.removeLayer(userLocMarker);
    userLocMarker = L.marker([lat, lng], {
      icon: L.divIcon({
        className: "custom-marker-wrapper",
        html: '<div class="loc-pulse"></div>',
        iconSize: [20, 20], iconAnchor: [10, 10]
      })
    }).addTo(map).bindPopup(t("თქვენი მდებარეობა", "Your Location"));
  }

  /* ---- ROUTE PANEL ---- */
  function populateRouteSelects() {
    var fromSel = document.getElementById("route-from");
    var toSel = document.getElementById("route-to");
    if (!fromSel || !toSel) return;

    // From: GPS first, then objects
    fromSel.innerHTML = '<option value="_gps">📍 ' + t("ჩემი მდებარეობა", "My Location") + '</option>' +
      '<option value="">' + t("აირჩიეთ...", "Select...") + '</option>';
    toSel.innerHTML = '<option value="">' + t("აირჩიეთ...", "Select...") + '</option>';

    allObjects.forEach(function (obj) {
      var opt = '<option value="' + obj.name + '">' + t(obj.title_ka, obj.title) + '</option>';
      fromSel.innerHTML += opt;
      toSel.innerHTML += opt;
    });
  }

  function calculateRoute() {
    var fromVal = document.getElementById("route-from").value;
    var toName  = document.getElementById("route-to").value;
    if (!toName) return;

    var toObj = allObjects.find(function (o) { return o.name === toName; });
    if (!toObj) return;

    clearRouteLayers();

    function runRoute(fromLat, fromLng) {
      var routeType = toObj.route_type || "drive";
      var isMixed = routeType === "mixed" && toObj.walk_from_lat && toObj.walk_from_lng;

      if (isMixed) {
        osrmRoute("driving", fromLat, fromLng, toObj.walk_from_lat, toObj.walk_from_lng)
          .then(function (seg1) {
            drawSegment(seg1.coords, "#2196F3", false);
            return osrmRoute("foot", toObj.walk_from_lat, toObj.walk_from_lng, toObj.latitude, toObj.longitude)
              .then(function (seg2) {
                drawSegment(seg2.coords, "#43A047", true);
                var all = seg1.coords.concat(seg2.coords);
                map.fitBounds(L.latLngBounds(all), { padding: [60, 60] });
                updateRouteInfo(seg1.distance + seg2.distance, seg1.duration, seg2.duration);
                showRouteLegend(true, true);
              });
          }).catch(function () { fallbackLine(fromLat, fromLng, toObj, "mixed"); });
      } else {
        var profile = routeType === "walk" ? "foot" : "driving";
        var color   = routeType === "walk" ? "#43A047" : "#2196F3";
        osrmRoute(profile, fromLat, fromLng, toObj.latitude, toObj.longitude)
          .then(function (seg) {
            drawSegment(seg.coords, color, routeType === "walk");
            map.fitBounds(L.latLngBounds(seg.coords), { padding: [60, 60] });
            updateRouteInfo(seg.distance, routeType === "walk" ? 0 : seg.duration, routeType === "walk" ? seg.duration : 0);
            showRouteLegend(routeType !== "walk", routeType === "walk");
          }).catch(function () { fallbackLine(fromLat, fromLng, toObj, routeType); });
      }
    }

    if (fromVal === "_gps") {
      if (userLocation) {
        runRoute(userLocation.lat, userLocation.lng);
      } else if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function (pos) {
          userLocation = { lat: pos.coords.latitude, lng: pos.coords.longitude };
          placeUserMarker(userLocation.lat, userLocation.lng);
          map.flyTo([userLocation.lat, userLocation.lng], 13, { duration: 1 });
          runRoute(userLocation.lat, userLocation.lng);
        }, function () {
          alert(t("GPS მიუწვდომელია", "GPS unavailable."));
        });
      }
    } else if (fromVal) {
      var fromObj = allObjects.find(function (o) { return o.name === fromVal; });
      if (fromObj) runRoute(fromObj.latitude, fromObj.longitude);
    }
  }

  function haversine(lat1, lon1, lat2, lon2) {
    var R = 6371;
    var dLat = (lat2 - lat1) * Math.PI / 180;
    var dLon = (lon2 - lon1) * Math.PI / 180;
    var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  }

  /* ---- LEGEND ---- */
  function renderLegend() {
    var legend = document.getElementById("map-legend");
    if (!legend) return;
    legend.innerHTML = "";
    allCategories.forEach(function (cat) {
      var item = el("div", "legend-item");
      item.innerHTML = '<span class="legend-dot" style="background:' + cat.color + '"></span>' +
        '<span>' + t(cat.category_name_ka, cat.category_name) + '</span>';
      legend.appendChild(item);
    });
  }

  /* ---- SEARCH ---- */
  function handleSearch(query) {
    var results = document.getElementById("search-results");
    if (!query || query.length < 2) {
      results.classList.remove("visible");
      return;
    }

    var q = query.toLowerCase();
    var matches = allObjects.filter(function (o) {
      return (o.title && o.title.toLowerCase().indexOf(q) >= 0) ||
        (o.title_ka && o.title_ka.toLowerCase().indexOf(q) >= 0) ||
        (o.category && o.category.toLowerCase().indexOf(q) >= 0);
    }).slice(0, 8);

    if (matches.length === 0) {
      results.classList.remove("visible");
      return;
    }

    results.innerHTML = "";
    matches.forEach(function (obj) {
      var item = el("div", "search-result-item");
      item.innerHTML =
        '<span class="result-dot" style="background:' + (obj.category_color || "#2E7D32") + '"></span>' +
        '<div><div class="result-text">' + t(obj.title_ka, obj.title) + '</div>' +
        '<div class="result-cat">' + t(obj.category_name_ka, obj.category) + '</div></div>';
      item.onclick = function () {
        results.classList.remove("visible");
        document.getElementById("search-input").value = "";
        window.__senakiOpenDetail(obj.name);
      };
      results.appendChild(item);
    });
    results.classList.add("visible");
  }

  /* ---- EVENTS ---- */
  function bindEvents() {
    // Close detail
    var closeBtn = document.getElementById("detail-close-btn");
    if (closeBtn) closeBtn.onclick = closeDetail;

    // Filter sidebar toggle
    var filterToggle = document.getElementById("filter-toggle");
    var sidebar = document.querySelector(".filter-sidebar");
    var sidebarOpen = document.getElementById("sidebar-open-btn");
    if (filterToggle && sidebar) {
      filterToggle.onclick = function () { sidebar.classList.add("collapsed"); };
    }
    if (sidebarOpen && sidebar) {
      sidebarOpen.onclick = function () { sidebar.classList.remove("collapsed"); };
    }

    // Map tile toggle
    var tileBtn = document.getElementById("btn-tile-toggle");
    if (tileBtn) {
      tileBtn.onclick = function () {
        if (currentTile === "street") {
          map.removeLayer(streetLayer);
          satelliteLayer.addTo(map);
          currentTile = "satellite";
          tileBtn.classList.add("active");
          tileBtn.textContent = "🗺️";
        } else {
          map.removeLayer(satelliteLayer);
          streetLayer.addTo(map);
          currentTile = "street";
          tileBtn.classList.remove("active");
          tileBtn.textContent = "🛰️";
        }
      };
    }

    // Zoom controls
    var zoomIn = document.getElementById("btn-zoom-in");
    var zoomOut = document.getElementById("btn-zoom-out");
    if (zoomIn) zoomIn.onclick = function () { map.zoomIn(); };
    if (zoomOut) zoomOut.onclick = function () { map.zoomOut(); };

    // Center on Senaki
    var centerBtn = document.getElementById("btn-center");
    if (centerBtn) {
      centerBtn.onclick = function () {
        map.flyTo([42.2697, 42.0697], 12, { duration: 1.2 });
      };
    }

    // My location
    var locBtn = document.getElementById("btn-my-location");
    if (locBtn) {
      locBtn.onclick = function () {
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(function (pos) {
            userLocation = { lat: pos.coords.latitude, lng: pos.coords.longitude };
            map.flyTo([userLocation.lat, userLocation.lng], 15, { duration: 1.2 });
            placeUserMarker(userLocation.lat, userLocation.lng);
          });
        }
      };
    }

    // Route panel
    var routeBtn = document.getElementById("btn-route");
    var routePanel = document.getElementById("route-panel");
    if (routeBtn && routePanel) {
      routeBtn.onclick = function () { routePanel.classList.toggle("open"); };
    }

    var routeCalcBtn = document.getElementById("route-calc-btn");
    if (routeCalcBtn) routeCalcBtn.onclick = calculateRoute;

    var routeCloseBtn = document.getElementById("route-close-btn");
    if (routeCloseBtn && routePanel) {
      routeCloseBtn.onclick = function () {
        routePanel.classList.remove("open");
        clearRouteLayers();
        document.querySelector(".route-info").style.display = "none";
        var legend = document.getElementById("route-mode-legend");
        if (legend) legend.style.display = "none";
      };
    }

    // Search
    var searchInput = document.getElementById("search-input");
    if (searchInput) {
      searchInput.oninput = function () { handleSearch(this.value); };
      searchInput.onfocus = function () { if (this.value.length >= 2) handleSearch(this.value); };
    }

    // Close search on outside click
    document.addEventListener("click", function (e) {
      if (!e.target.closest(".navbar-search") && !e.target.closest(".search-results")) {
        var sr = document.getElementById("search-results");
        if (sr) sr.classList.remove("visible");
      }
    });

    // Language toggle
    document.querySelectorAll(".lang-btn").forEach(function (btn) {
      btn.onclick = function () {
        currentLang = this.getAttribute("data-lang");
        document.querySelectorAll(".lang-btn").forEach(function (b) { b.classList.remove("active"); });
        this.classList.add("active");
        renderFilters();
        renderMarkers();
        renderLegend();
        populateRouteSelects();
        if (selectedObject) window.__senakiOpenDetail(selectedObject.name);
      };
    });
  }

  /* ---- HELPERS ---- */
  function t(ka, en) {
    return currentLang === "ka" ? (ka || en || "") : (en || ka || "");
  }

  function el(tag, className, attrs) {
    var e = document.createElement(tag);
    if (className) e.className = className;
    if (attrs) Object.keys(attrs).forEach(function (k) { e.setAttribute(k, attrs[k]); });
    return e;
  }

  function stripHtml(html) {
    var tmp = document.createElement("div");
    tmp.innerHTML = html || "";
    return tmp.textContent || tmp.innerText || "";
  }

  /* ---- START ---- */
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
