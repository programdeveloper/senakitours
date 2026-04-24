# Copyright (c) 2026, Senaki Municipality and contributors
# For license information, please see license.txt

import frappe


def after_install():
    """Seed initial tourist categories and objects after app installation."""
    create_categories()
    create_tourist_objects()
    frappe.db.commit()
    print("✅ Senaki Tours: Seed data installed successfully!")


def create_categories():
    """Create default tourist categories."""
    categories = [
        {
            "category_name": "Historical Monuments",
            "category_name_ka": "ისტორიული ძეგლები",
            "color": "#C62828",
            "icon": "🏛️",
            "sort_order": 1,
        },
        {
            "category_name": "Cultural Sites",
            "category_name_ka": "კულტურული ობიექტები",
            "color": "#EF6C00",
            "icon": "🎭",
            "sort_order": 2,
        },
        {
            "category_name": "Religious Sites",
            "category_name_ka": "რელიგიური ობიექტები",
            "color": "#7B1FA2",
            "icon": "⛪",
            "sort_order": 3,
        },
        {
            "category_name": "Fortresses",
            "category_name_ka": "ციხე-სიმაგრეები",
            "color": "#4E342E",
            "icon": "🏰",
            "sort_order": 4,
        },
        {
            "category_name": "Nature & Parks",
            "category_name_ka": "ბუნება და პარკები",
            "color": "#2E7D32",
            "icon": "🌿",
            "sort_order": 5,
        },
        {
            "category_name": "Hotels & Accommodation",
            "category_name_ka": "სასტუმროები",
            "color": "#1565C0",
            "icon": "🏨",
            "sort_order": 6,
        },
        {
            "category_name": "Restaurants & Food",
            "category_name_ka": "რესტორნები და კვება",
            "color": "#00695C",
            "icon": "🍽️",
            "sort_order": 7,
        },
        {
            "category_name": "Entertainment",
            "category_name_ka": "გართობა და დასვენება",
            "color": "#AD1457",
            "icon": "🎉",
            "sort_order": 8,
        },
        {
            "category_name": "Transport",
            "category_name_ka": "ტრანსპორტი",
            "color": "#37474F",
            "icon": "🚗",
            "sort_order": 9,
        },
    ]

    for cat_data in categories:
        if not frappe.db.exists("Tourist Category", cat_data["category_name"]):
            doc = frappe.get_doc({
                "doctype": "Tourist Category",
                **cat_data
            })
            doc.insert(ignore_permissions=True)
            print(f"  Created category: {cat_data['category_name']}")


def create_tourist_objects():
    """Create seed tourist objects with real Senaki attractions."""
    objects = [
        {
            "title": "Nokalakevi (Archaeopolis)",
            "title_ka": "ნოქალაქევი (არქეოპოლისი)",
            "category": "Historical Monuments",
            "latitude": 42.3572,
            "longitude": 42.1939,
            "address": "Nokalakevi Village, Senaki Municipality",
            "published": 1,
            "description": """<p>Located 15 kilometers from Senaki, Nokalakevi is a place where the history
            of the Colchis and Egrisi kingdoms comes to life. Built on the banks of the Tekhuri River,
            the Archaeopolis — the residence of King Gubaz — was a citadel, royal quarters, a sacred home.</p>
            <p>This is an open-air archaeological kingdom where you can walk through time. The impressive walls
            with its seals, strong walls and the distinctive spirit that created the history of united Georgia.</p>
            <p>The fortress complex includes the Church of the Forty Martyrs, ancient baths, palace foundations,
            and a three-tiered defensive system dating from the 4th-6th centuries.</p>""",
            "description_ka": """<p>სენაკიდან 15 კილომეტრში მდებარე ნოქალაქევი ადგილია, სადაც კოლხეთისა
            და ეგრისის სამეფოების ისტორია ცოცხლდება. თეხურის ნაპირას აშენებული არქეოპოლისი —
            მეფე გუბაზის რეზიდენცია — ციტადელი, სამეფო კვარტალი, წმინდა სახლი იყო.</p>
            <p>ეს არის ღია ცის ქვეშ არქეოლოგიური სამეფო, სადაც შეგიძლიათ დროში იმოგზაუროთ.</p>""",
        },
        {
            "title": "Senaki Drama Theater",
            "title_ka": "სენაკის დრამატული თეატრი",
            "category": "Cultural Sites",
            "latitude": 42.2697,
            "longitude": 42.0680,
            "address": "Central Square, Senaki",
            "published": 1,
            "description": """<p>The Akaki Khorava Drama Theatre is a cultural heart of Senaki city.
            Theatrical history in Senaki begins at the end of the 19th century and the theater has been
            one of the towns with the strongest cultural traditions in Georgia.</p>
            <p>The theater building, built in the 1930s on the city's central square, is a monument of
            Georgian cultural heritage and a real landmark of the city. The elegant Baroque style columns,
            ornaments and interior decoration make it architecturally significant.</p>""",
            "description_ka": """<p>აკაკი ხორავას სახელობის დრამატული თეატრი სენაკის ქალაქის კულტურული
            გულია. თეატრალური ისტორია სენაკში XIX საუკუნის ბოლოდან იწყება და თეატრი ერთ-ერთი
            ყველაზე ძლიერი კულტურული ტრადიციების მქონე ქალაქია საქართველოში.</p>""",
        },
        {
            "title": "Shkhepi Fortress",
            "title_ka": "შხეპის ციხე",
            "category": "Fortresses",
            "latitude": 42.2800,
            "longitude": 42.1000,
            "address": "Shkhepi Village, Senaki Municipality",
            "published": 1,
            "description": """<p>Located in the village of Shkhepi near Senaki, this castle is one of the
            most interesting centers of medieval Georgian history. It was part of the defensive chain of the
            Dadiani dynasty. Its stone walls have preserved an impressive fortification from the 15th-17th centuries.</p>
            <p>Shkhepi was also unique in the development of its water supply system — an engineering and ceramic
            pipes, which supplied water to the fortress from a distance of one kilometer, using the principle
            of a natural spring.</p>""",
            "description_ka": """<p>სენაკთან ახლოს, შხეპის სოფელში მდებარე ეს ციხე შუა საუკუნეების
            ქართული ისტორიის ერთ-ერთი ყველაზე საინტერესო ცენტრია. იგი დადიანების სამთავროს
            თავდაცვითი ჯაჭვის ნაწილი იყო.</p>""",
        },
        {
            "title": "Menji Archangels Church",
            "title_ka": "მენჯის მთავარანგელოზთა ეკლესია",
            "category": "Religious Sites",
            "latitude": 42.2600,
            "longitude": 42.0500,
            "address": "Menji Village, Senaki Municipality",
            "published": 1,
            "description": """<p>A spiritual center that protects Senaki. Located 5 kilometers from the city center,
            the Archangels Church was built in 1899 by the venerable Father Alexi Shushanashvili,
            on a mountain ridge of Mount Eki, where a miraculous icon appeared.</p>
            <p>The Menji Church invites the traveler as a quiet, spiritual place of prayer where
            ancient architecture and the natural landscape merge with the natural city.</p>""",
            "description_ka": """<p>სულიერი ცენტრი, რომელიც სენაკს იცავს. ქალაქის ცენტრიდან 5 კილომეტრში
            მდებარე მთავარანგელოზთა ეკლესია 1899 წელს აშენდა.</p>""",
        },
        {
            "title": "Kolkheti National Park",
            "title_ka": "კოლხეთის ეროვნული პარკი",
            "category": "Nature & Parks",
            "latitude": 42.1800,
            "longitude": 41.9800,
            "address": "Senaki Municipality / Khobi Municipality",
            "published": 1,
            "description": """<p>The Kolkheti National Park is one of Georgia's most important protected areas,
            featuring unique wetland ecosystems that have remained largely unchanged for millions of years.
            The park protects relict Colchic forests and peat bogs of international significance.</p>
            <p>The park is home to diverse wildlife including rare bird species, and offers eco-tourism
            opportunities including boat tours through the wetlands and birdwatching excursions.</p>""",
            "description_ka": """<p>კოლხეთის ეროვნული პარკი საქართველოს ერთ-ერთი ყველაზე მნიშვნელოვანი
            დაცული ტერიტორიაა, რომელიც უნიკალურ ჭაობის ეკოსისტემებს მოიცავს.</p>""",
        },
        {
            "title": "Senaki Railway Station",
            "title_ka": "სენაკის რკინიგზის სადგური",
            "category": "Transport",
            "latitude": 42.2670,
            "longitude": 42.0640,
            "address": "Railway Station, Senaki",
            "published": 1,
            "description": """<p>The Senaki Railway Station is one of the important transport hubs of Western Georgia.
            It connects the town with Tbilisi, Batumi, Zugdidi, and other major cities. The station is also
            historically significant as the first car in Georgia arrived by train to Senaki in 1908.</p>""",
            "description_ka": """<p>სენაკის რკინიგზის სადგური დასავლეთ საქართველოს ერთ-ერთი მნიშვნელოვანი
            სატრანსპორტო კვანძია.</p>""",
        },
        {
            "title": "Nokalakevi Thermal Spring",
            "title_ka": "ნოქალაქევის თერმული წყარო",
            "category": "Nature & Parks",
            "latitude": 42.3656,
            "longitude": 42.1954,
            "address": "Near Nokalakevi, Senaki Municipality",
            "published": 1,
            "description": """<p>The Nokalakevi Thermal Spring is a natural wonder located near the archaeological
            site of Nokalakevi. Known for its sulfur-rich waters and natural river pools, the spring attracts
            visitors seeking both relaxation and therapeutic benefits.</p>""",
            "description_ka": """<p>ნოქალაქევის თერმული წყარო ბუნებრივი სასწაულია, რომელიც ნოქალაქევის
            არქეოლოგიური ძეგლის მახლობლად მდებარეობს.</p>""",
        },
        {
            "title": "Teklati Nunnery",
            "title_ka": "ტეკლათის მონასტერი",
            "category": "Religious Sites",
            "latitude": 42.3000,
            "longitude": 42.0200,
            "address": "Teklati, Senaki Municipality",
            "published": 1,
            "description": """<p>A 19th-century convent located in the village of Teklati. This peaceful
            religious complex features beautiful architecture and is an important spiritual destination
            for pilgrims visiting the Senaki region.</p>""",
            "description_ka": """<p>XIX საუკუნის მონასტერი, რომელიც ტეკლათის სოფელში მდებარეობს.</p>""",
        },
        {
            "title": "Senaki City Park",
            "title_ka": "სენაკის საქალაქო პარკი",
            "category": "Entertainment",
            "latitude": 42.2680,
            "longitude": 42.0660,
            "address": "Central Senaki",
            "published": 1,
            "description": """<p>The central park of Senaki offers a green oasis in the heart of the city.
            With walking paths, playgrounds, and resting areas, it serves as the primary recreational
            space for both locals and visitors.</p>""",
            "description_ka": """<p>სენაკის ცენტრალური პარკი ქალაქის გულში მწვანე ოაზისს წარმოადგენს.</p>""",
        },
        {
            "title": "Kotianeti Fortress",
            "title_ka": "კოტიანეთის ციხე",
            "category": "Fortresses",
            "latitude": 42.2950,
            "longitude": 42.0850,
            "address": "Kotianeti Village, Senaki Municipality",
            "published": 1,
            "description": """<p>An 18th-century fortification located in Kotianeti village. The fortress
            was part of the defensive network of the Odishi (Samegrelo) principality and played a
            strategic role in the region's military history.</p>""",
            "description_ka": """<p>XVIII საუკუნის ციხე-სიმაგრე, რომელიც კოტიანეთის სოფელში მდებარეობს.</p>""",
        },
    ]

    for obj_data in objects:
        # Check if already exists by title
        existing = frappe.db.exists("Tourist Object", {"title": obj_data["title"]})
        if not existing:
            doc = frappe.get_doc({
                "doctype": "Tourist Object",
                **obj_data
            })
            doc.insert(ignore_permissions=True)
            print(f"  Created object: {obj_data['title']}")
