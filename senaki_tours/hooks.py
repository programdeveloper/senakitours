app_name = "senaki_tours"
app_title = "Senaki Tours"
app_publisher = "Senaki Municipality"
app_description = "Digital Tourist Guide for Senaki Municipality, Georgia"
app_email = "info@senaki.gov.ge"
app_license = "MIT"

# Apps
# ------------------

# required_apps = []

# Each item in the list will be shown as an app in the apps page
# add_to_apps_screen = [
# 	{
# 		"name": "senaki_tours",
# 		"logo": "/assets/senaki_tours/images/logo.png",
# 		"title": "Senaki Tours",
# 		"route": "/tours",
# 	}
# ]

# Includes in <head>
# ------------------

# include js, css files in header of desk.html
# app_include_css = "/assets/senaki_tours/css/senaki_tours.css"
# app_include_js = "/assets/senaki_tours/js/senaki_tours.js"

# include js, css files in header of web template
# web_include_css = "/assets/senaki_tours/css/senaki_tours.css"
# web_include_js = "/assets/senaki_tours/js/senaki_tours.js"

# include custom scss in every website theme (without signing in)
# website_theme_scss = "senaki_tours/public/scss/website"

# include js in page
# page_js = {"page" : "public/js/file.js"}

# include js in doctype views
# doctype_js = {"doctype" : "public/js/doctype.js"}
# doctype_list_js = {"doctype" : "public/js/doctype_list.js"}
# doctype_tree_js = {"doctype" : "public/js/doctype_tree.js"}
# doctype_calendar_js = {"doctype" : "public/js/doctype_calendar.js"}

# Svg Generators
# --------------------
# from frappe.utils.password import get_gravatar
# app_logo_url = get_gravatar("test@example.com", "")

# Home Pages
# ----------

# application home page (will override Website Settings)
# home_page = "tours"

# website user home page (by Role)
# role_home_page = {
# 	"Role": "home_page"
# }

# Generators
# ----------

# automatically create page for each record of this doctype
# website_generators = ["Web Page"]

# Jinja
# ----------

# add methods and filters to jinja environment
# jinja = {
# 	"methods": "senaki_tours.utils.jinja_methods",
# 	"filters": "senaki_tours.utils.jinja_filters"
# }

# Installation
# ------------

# before_install = "senaki_tours.install.before_install"
after_install = "senaki_tours.install.after_install"

# Uninstallation
# ------------

# before_uninstall = "senaki_tours.uninstall.before_uninstall"
# after_uninstall = "senaki_tours.uninstall.after_uninstall"

# Integration Setup
# ------------------
# To set up dependencies/integrations with other apps

# Desk Notifications
# ------------------
# See frappe.core.notifications.get_notification_config

# notification_config = "senaki_tours.notifications.get_notification_config"

# Permissions
# -----------
# Permissions evaluated in scripted ways

# permission_query_conditions = {
# 	"Event": "frappe.desk.doctype.event.event.get_permission_query_conditions",
# }

# has_permission = {
# 	"Event": "frappe.desk.doctype.event.event.has_permission",
# }

# DocType Class
# ---------------
# Override standard doctype classes

# override_doctype_class = {
# 	"ToDo": "custom_app.overrides.CustomToDo"
# }

# Document Events
# ---------------
# Hook on document methods and events

# doc_events = {
# 	"*": {
# 		"on_update": "method",
# 		"on_cancel": "method",
# 		"on_trash": "method"
# 	}
# }

# Scheduled Tasks
# ---------------

# scheduler_events = {
# 	"all": [
# 		"senaki_tours.tasks.all"
# 	],
# }

# Testing
# -------

# before_tests = "senaki_tours.install.before_tests"

# Overriding Methods
# ------------------------------

# override_whitelisted_methods = {
# 	"frappe.desk.doctype.event.event.get_events": "senaki_tours.event.get_events"
# }

# each overriding function accepts a `data` argument;
# generated from the base implementation of the doctype dashboard,
# along with any modifications made in other Frappe apps
# override_doctype_dashboards = {
# 	"Task": "senaki_tours.task.get_dashboard_data"
# }

# exempt linked doctypes from being automatically cancelled
# auto_cancel_exempted_doctypes = ["Auto Repeat"]

# Ignore links to specified DocTypes when deleting documents
# ignore_links_on_delete = ["Communication", "ToDo"]

# Request Events
# ----------------
# before_request = ["senaki_tours.utils.before_request"]
# after_request = ["senaki_tours.utils.after_request"]

# Job Events
# ----------
# before_job = ["senaki_tours.utils.before_job"]
# after_job = ["senaki_tours.utils.after_job"]

fixtures = [
    {
        "dt": "Tourist Category",
        "filters": []
    }
]

# User Data Protection
# --------------------

# user_data_fields = [
# 	{
# 		"doctype": "{doctype_1}",
# 		"filter_by": "{filter_by}",
# 		"redact_fields": ["{field_1}", "{field_2}"],
# 		"partial": 1,
# 	},
# ]

# Authentication and authorization
# --------------------------------

# auth_hooks = [
# 	"senaki_tours.auth.validate"
# ]

# Automatically update python controller files with type annotations for this app.
# export_python_type_annotations = True
