# Copyright (c) 2026, Senaki Municipality and contributors
# For license information, please see license.txt

import frappe


@frappe.whitelist(allow_guest=True)
def get_tourist_objects(category=None):
    """Return all published tourist objects, optionally filtered by category."""
    filters = {"published": 1}
    if category:
        filters["category"] = category

    objects = frappe.get_all(
        "Tourist Object",
        filters=filters,
        fields=[
            "name", "title", "title_ka", "category",
            "description", "description_ka",
            "latitude", "longitude", "address",
            "image", "phone", "website",
            "working_hours", "google_maps_url",
            "route_type", "walk_from_lat", "walk_from_lng"
        ],
        order_by="title asc"
    )

    # Attach category metadata
    for obj in objects:
        cat = frappe.get_cached_doc("Tourist Category", obj["category"])
        obj["category_color"] = cat.color
        obj["category_icon"] = cat.icon
        obj["category_name_ka"] = cat.category_name_ka

    return objects


@frappe.whitelist(allow_guest=True)
def get_categories():
    """Return all tourist categories."""
    return frappe.get_all(
        "Tourist Category",
        fields=[
            "name", "category_name", "category_name_ka",
            "color", "icon", "sort_order"
        ],
        order_by="sort_order asc"
    )


@frappe.whitelist(allow_guest=True)
def get_object_detail(name):
    """Return full detail for a single tourist object."""
    obj = frappe.get_doc("Tourist Object", name)
    cat = frappe.get_cached_doc("Tourist Category", obj.category)

    gallery = []
    if obj.gallery:
        for img in obj.gallery:
            gallery.append({
                "image": img.image,
                "caption": img.caption
            })

    return {
        "name": obj.name,
        "title": obj.title,
        "title_ka": obj.title_ka,
        "category": obj.category,
        "category_color": cat.color,
        "category_icon": cat.icon,
        "category_name_ka": cat.category_name_ka,
        "description": obj.description,
        "description_ka": obj.description_ka,
        "latitude": obj.latitude,
        "longitude": obj.longitude,
        "address": obj.address,
        "image": obj.image,
        "phone": obj.phone,
        "website": obj.website,
        "working_hours": obj.working_hours,
        "google_maps_url": obj.google_maps_url,
        "route_type": obj.route_type,
        "walk_from_lat": obj.walk_from_lat,
        "walk_from_lng": obj.walk_from_lng,
        "gallery": gallery,
    }


@frappe.whitelist(allow_guest=True)
def get_routes():
    """Return all tourist routes."""
    routes = frappe.get_all(
        "Tourist Route",
        fields=[
            "name", "route_name", "route_name_ka",
            "from_object", "to_object",
            "distance_km", "duration_min", "route_type"
        ]
    )

    for route in routes:
        from_obj = frappe.get_doc("Tourist Object", route["from_object"])
        to_obj = frappe.get_doc("Tourist Object", route["to_object"])
        route["from_lat"] = from_obj.latitude
        route["from_lng"] = from_obj.longitude
        route["from_title"] = from_obj.title
        route["to_lat"] = to_obj.latitude
        route["to_lng"] = to_obj.longitude
        route["to_title"] = to_obj.title

    return routes
