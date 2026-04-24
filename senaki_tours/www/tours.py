# Copyright (c) 2026, Senaki Municipality and contributors
# For license information, please see license.txt

import frappe

no_cache = 1


def get_context(context):
    context.no_cache = 1
    context.no_header = 1
    context.no_breadcrumbs = 1
    context.no_sidebar = 1
    context.title = "სენაკის ტურისტული რუკა — Senaki Tourist Map"

    # Pre-load data for server-side rendering
    context.categories = frappe.get_all(
        "Tourist Category",
        fields=["name", "category_name", "category_name_ka", "color", "icon", "sort_order"],
        order_by="sort_order asc"
    )

    context.tourist_objects = frappe.get_all(
        "Tourist Object",
        filters={"published": 1},
        fields=[
            "name", "title", "title_ka", "category",
            "description", "description_ka",
            "latitude", "longitude", "address",
            "image", "phone", "website",
            "working_hours", "google_maps_url"
        ],
        order_by="title asc"
    )

    # Attach category color/icon to each object
    cat_map = {c.name: c for c in context.categories}
    for obj in context.tourist_objects:
        cat = cat_map.get(obj.get("category"), {})
        obj["category_color"] = getattr(cat, "color", "#2E7D32")
        obj["category_icon"] = getattr(cat, "icon", "📍")
        obj["category_name_ka"] = getattr(cat, "category_name_ka", "")
