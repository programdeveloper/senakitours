# Copyright (c) 2026, Senaki Municipality and contributors
# For license information, please see license.txt

import frappe
from frappe.model.document import Document


class TouristObject(Document):
    def before_save(self):
        """Auto-generate Google Maps URL from coordinates."""
        if self.latitude and self.longitude:
            self.google_maps_url = (
                f"https://www.google.com/maps?q={self.latitude},{self.longitude}"
            )
