from pathlib import Path
import textwrap


OUTPUT = Path("Hotel_Ganesh_Website_System_Guide.pdf")
PAGE_WIDTH = 612
PAGE_HEIGHT = 792
LEFT = 54
TOP = 734
BOTTOM = 58
LINE = 15


def pdf_escape(text):
    return (
        text.replace("\\", "\\\\")
        .replace("(", "\\(")
        .replace(")", "\\)")
        .replace("\r", "")
    )


def wrap(text, width=88):
    if not text:
        return [""]
    lines = []
    for paragraph in text.split("\n"):
      if not paragraph:
          lines.append("")
      else:
          lines.extend(textwrap.wrap(paragraph, width=width))
    return lines


class PdfBuilder:
    def __init__(self):
        self.pages = []
        self.current = []
        self.y = TOP
        self.page_number = 0

    def new_page(self):
        if self.current:
            self._footer()
            self.pages.append("\n".join(self.current))
        self.current = []
        self.y = TOP
        self.page_number += 1
        self.text("Hotel Ganesh International Website System Guide", 9, bold=True, color=(85, 85, 85))
        self.line()
        self.y -= 18

    def ensure(self, needed):
        if self.y - needed < BOTTOM:
            self.new_page()

    def text(self, text, size=11, bold=False, color=(0, 0, 0), indent=0):
        self.ensure(size + 6)
        font = "F2" if bold else "F1"
        r, g, b = color
        self.current.append(
            f"BT /{font} {size} Tf {r:.3f} {g:.3f} {b:.3f} rg {LEFT + indent} {self.y} Td ({pdf_escape(text)}) Tj ET"
        )
        self.y -= int(size * 1.35)

    def para(self, text, size=11, indent=0):
        for line in wrap(text):
            self.text(line, size=size, indent=indent)
        self.y -= 4

    def heading(self, text):
        self.y -= 8
        self.text(text, 16, bold=True, color=(20 / 255, 52 / 255, 92 / 255))
        self.y -= 2

    def subheading(self, text):
        self.y -= 5
        self.text(text, 12, bold=True, color=(28 / 255, 74 / 255, 130 / 255))

    def bullet(self, text):
        for idx, line in enumerate(wrap(text, 82)):
            prefix = "- " if idx == 0 else "  "
            self.text(prefix + line, 10.5, indent=18)
        self.y -= 2

    def code(self, text):
        self.ensure(18)
        self.current.append(f"0.965 0.972 0.985 rg {LEFT} {self.y - 3} 504 17 re f")
        self.text(text, 9.5, color=(25 / 255, 35 / 255, 55 / 255), indent=8)

    def line(self):
        self.current.append(f"0.82 0.86 0.9 RG 0.6 w {LEFT} {self.y - 5} m {PAGE_WIDTH - LEFT} {self.y - 5} l S")

    def callout(self, title, body):
        self.ensure(72)
        self.current.append(f"0.925 0.960 1.000 rg {LEFT} {self.y - 58} 504 62 re f")
        self.current.append(f"0.55 0.72 0.92 RG 0.8 w {LEFT} {self.y - 58} 504 62 re S")
        self.text(title, 11, bold=True, color=(20 / 255, 72 / 255, 135 / 255), indent=10)
        for line in wrap(body, 76):
            self.text(line, 10, indent=10)
        self.y -= 8

    def _footer(self):
        self.current.append(
            f"BT /F1 9 Tf 0.45 0.45 0.45 rg {PAGE_WIDTH - 96} 34 Td (Page {self.page_number}) Tj ET"
        )

    def save(self, path):
        if self.current:
            self._footer()
            self.pages.append("\n".join(self.current))

        objects = []
        objects.append("<< /Type /Catalog /Pages 2 0 R >>")
        kids = " ".join(f"{3 + i * 2} 0 R" for i in range(len(self.pages)))
        objects.append(f"<< /Type /Pages /Kids [{kids}] /Count {len(self.pages)} >>")

        for i, content in enumerate(self.pages):
            page_obj_num = 3 + i * 2
            content_obj_num = page_obj_num + 1
            objects.append(
                f"<< /Type /Page /Parent 2 0 R /MediaBox [0 0 {PAGE_WIDTH} {PAGE_HEIGHT}] "
                f"/Resources << /Font << /F1 {3 + len(self.pages) * 2} 0 R /F2 {4 + len(self.pages) * 2} 0 R >> >> "
                f"/Contents {content_obj_num} 0 R >>"
            )
            stream = content.encode("utf-8")
            objects.append(f"<< /Length {len(stream)} >>\nstream\n{content}\nendstream")

        objects.append("<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>")
        objects.append("<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold >>")

        pdf = bytearray(b"%PDF-1.4\n%\xe2\xe3\xcf\xd3\n")
        offsets = [0]
        for idx, obj in enumerate(objects, 1):
            offsets.append(len(pdf))
            pdf.extend(f"{idx} 0 obj\n{obj}\nendobj\n".encode("utf-8"))

        xref = len(pdf)
        pdf.extend(f"xref\n0 {len(objects) + 1}\n".encode("utf-8"))
        pdf.extend(b"0000000000 65535 f \n")
        for offset in offsets[1:]:
            pdf.extend(f"{offset:010d} 00000 n \n".encode("utf-8"))
        pdf.extend(
            f"trailer\n<< /Size {len(objects) + 1} /Root 1 0 R >>\nstartxref\n{xref}\n%%EOF\n".encode("utf-8")
        )
        path.write_bytes(pdf)


def build():
    pdf = PdfBuilder()
    pdf.new_page()

    pdf.text("Hotel Ganesh International", 23, bold=True, color=(11 / 255, 31 / 255, 65 / 255))
    pdf.text("Website, Booking, Payment, Google Sheets, Reviews, and Map Guide", 13, color=(70 / 255, 85 / 255, 105 / 255))
    pdf.y -= 12
    pdf.para("This PDF explains the full code setup in simple step-by-step language. It is written so you can understand what happens when a guest books a room, pays online, and receives a verified confirmation.")
    pdf.callout("One-line idea", "The website is the front desk, the API folder is the hidden staff room, Razorpay collects money, and Google Sheets stores confirmed bookings.")

    pdf.heading("1. Main Parts of the Project")
    pdf.bullet("Frontend: React pages and components inside src/. This is what visitors see in the browser.")
    pdf.bullet("Backend/API: files inside api/. These run secretly on the server and talk to Razorpay and Google Sheets.")
    pdf.bullet("Environment files: .env stores public frontend settings; api/.env stores private backend secrets.")
    pdf.bullet("External services: Razorpay for payments, Google Sheets for booking records, Google Business/Profile for reviews, Google Maps for location.")

    pdf.heading("2. Important Files")
    files = [
        ("src/pages/BookingPage.jsx", "Main booking form and Razorpay checkout flow."),
        ("api/create-razorpay-order.js", "Creates a Razorpay order after validating booking details."),
        ("api/verify-razorpay-payment.js", "Verifies Razorpay signature and saves confirmed booking."),
        ("google-sheets-apps-script.js", "Code pasted into Google Sheets Apps Script to append rows."),
        ("src/components/GoogleReviews.jsx", "Shows review cards and the Write a Review button."),
        ("src/components/FooterMap.jsx", "Shows the Google Map using Barh, Patna, Bihar query."),
        ("vite.config.js", "Lets API routes work locally during npm run dev."),
    ]
    for name, desc in files:
        pdf.bullet(f"{name}: {desc}")

    pdf.heading("3. Booking Flow Like a Child")
    pdf.bullet("Guest fills name, phone, email, dates, room type, room count, and guests.")
    pdf.bullet("Browser calculates a visible total so the guest can see the price.")
    pdf.bullet("When guest clicks Pay, the browser sends booking details to the backend.")
    pdf.bullet("Backend checks the details again and calculates the real total itself.")
    pdf.bullet("Backend asks Razorpay to create an order for that real total.")
    pdf.bullet("Razorpay gives back an order ID. The browser opens Razorpay checkout.")

    pdf.subheading("Why the backend calculates amount again")
    pdf.para("A browser can be edited by a clever user. If the website trusted the browser amount, someone could try to pay Rs. 1 for a Rs. 4032 booking. The backend prevents this by calculating the amount again.")

    pdf.heading("4. Razorpay Order Creation")
    pdf.para("File: api/create-razorpay-order.js")
    pdf.bullet("Loads RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET from api/.env.")
    pdf.bullet("Checks that the room exists.")
    pdf.bullet("Checks email, phone, dates, guests, and room availability.")
    pdf.bullet("Calculates subtotal, GST, and total.")
    pdf.bullet("Calls Razorpay Orders API and creates an order.")
    pdf.bullet("Returns order ID, amount, currency, receipt, and booking summary to the frontend.")
    pdf.code("Example total: 1200 x 3 nights = 3600, GST 12% = 432, total = 4032")

    pdf.heading("5. Razorpay Payment Verification")
    pdf.para("File: api/verify-razorpay-payment.js")
    pdf.bullet("After payment, Razorpay returns order ID, payment ID, and signature.")
    pdf.bullet("Frontend sends those details to the backend.")
    pdf.bullet("Backend creates its own expected signature using the Razorpay secret.")
    pdf.bullet("If Razorpay signature and backend signature match, the payment is real.")
    pdf.bullet("Only then the website shows Booking Confirmed.")
    pdf.callout("Important", "A bank message means money came in. Signature verification proves that this website booking belongs to that Razorpay payment.")

    pdf.heading("6. Google Sheets Booking Record")
    pdf.para("File: google-sheets-apps-script.js")
    pdf.bullet("You pasted this code into Google Sheets > Extensions > Apps Script.")
    pdf.bullet("You deployed it as a Web App and copied the /exec URL.")
    pdf.bullet("That URL is stored in api/.env as GOOGLE_SHEETS_WEBHOOK_URL.")
    pdf.bullet("After payment verification, the backend posts booking details to that URL.")
    pdf.bullet("Google Apps Script appends a row in the Bookings sheet.")
    pdf.subheading("Sheet columns")
    for item in ["Confirmed At", "Booking Reference", "Guest Name", "Phone", "Email", "Room", "Check In", "Check Out", "Nights", "Rooms", "Guests", "Subtotal", "GST", "Total Paid", "Payment ID", "Order ID"]:
        pdf.bullet(item)

    pdf.heading("7. Environment Files")
    pdf.subheading("api/.env: private backend values")
    pdf.code("RAZORPAY_KEY_ID=rzp_test_or_live_xxxxx")
    pdf.code("RAZORPAY_KEY_SECRET=your_secret_key")
    pdf.code("GOOGLE_SHEETS_WEBHOOK_URL=https://script.google.com/macros/s/.../exec")
    pdf.para("Never expose RAZORPAY_KEY_SECRET in frontend files. It belongs only on the backend/server.")

    pdf.subheading("Root .env: public frontend values")
    pdf.code("VITE_GOOGLE_REVIEW_URL=https://g.page/r/.../review")
    pdf.code("VITE_GOOGLE_MAP_QUERY=Hotel Ganesh International, Barh, Patna, Bihar")
    pdf.para("Vite only reads frontend variables from the root .env file. That is why the review link needed to be placed outside api/.env.")

    pdf.heading("8. Google Review Button")
    pdf.para("File: src/components/GoogleReviews.jsx")
    pdf.bullet("The section shows review cards.")
    pdf.bullet("The Write a Review button uses VITE_GOOGLE_REVIEW_URL.")
    pdf.bullet("A Google Maps API key is not needed just for the Write a Review button.")
    pdf.bullet("Live Google reviews need Google Maps API key and exact Place ID, but that is optional.")

    pdf.heading("9. Google Map Location")
    pdf.para("File: src/components/FooterMap.jsx")
    pdf.bullet("The map query is set to Hotel Ganesh International, Barh, Patna, Bihar.")
    pdf.bullet("This avoids Google choosing another Hotel Ganesh International in a different state.")
    pdf.bullet("If you use VITE_GOOGLE_PLACE_ID later, make sure it is the exact Barh listing.")

    pdf.heading("10. Local Development Setup")
    pdf.para("File: vite.config.js")
    pdf.bullet("Normally Vite only runs the React frontend.")
    pdf.bullet("I added local middleware so /api/create-razorpay-order and /api/verify-razorpay-payment work during npm run dev.")
    pdf.bullet("After changing .env or vite.config.js, restart npm run dev.")
    pdf.code("npm run dev")

    pdf.heading("11. Speed Improvements")
    pdf.bullet("Large PNG hotel photos were converted to smaller JPG files.")
    pdf.bullet("Images now lazy-load where possible.")
    pdf.bullet("Google Reviews script is delayed until the review section is near the screen.")
    pdf.bullet("Razorpay checkout script is preloaded on the booking page.")
    pdf.bullet("Build output now shows much smaller image sizes, mostly under 80 KB and the largest around 164 KB.")

    pdf.heading("12. Going Live Checklist")
    pdf.bullet("Activate Razorpay Live Mode after KYC/business approval.")
    pdf.bullet("Replace test keys with live keys in Vercel environment variables.")
    pdf.bullet("Add GOOGLE_SHEETS_WEBHOOK_URL to Vercel environment variables.")
    pdf.bullet("Add VITE_GOOGLE_REVIEW_URL and VITE_GOOGLE_MAP_QUERY to Vercel environment variables.")
    pdf.bullet("Deploy again after changing environment variables.")
    pdf.bullet("Make one small live payment test.")
    pdf.bullet("Confirm payment appears in Razorpay Dashboard.")
    pdf.bullet("Confirm booking row appears in Google Sheets.")
    pdf.bullet("Confirm map points to Barh, Patna, Bihar.")
    pdf.bullet("Confirm Write a Review button opens your Google Business review page.")

    pdf.heading("13. Common Problems")
    pdf.subheading("Payment says cannot create order")
    pdf.bullet("Check RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET in api/.env or Vercel env.")
    pdf.bullet("Restart npm run dev after env changes.")
    pdf.bullet("Make sure the backend API route is available.")

    pdf.subheading("Payment done but not confirmed")
    pdf.bullet("The server could not verify signature or save to Google Sheets.")
    pdf.bullet("Check Razorpay secret and Google Sheets webhook URL.")
    pdf.bullet("Ask guest for payment ID if needed.")

    pdf.subheading("Write a Review button missing")
    pdf.bullet("Put VITE_GOOGLE_REVIEW_URL in root .env, not api/.env.")
    pdf.bullet("Restart npm run dev.")

    pdf.subheading("Map shows wrong hotel")
    pdf.bullet("Use VITE_GOOGLE_MAP_QUERY=Hotel Ganesh International, Barh, Patna, Bihar.")
    pdf.bullet("Do not use a wrong Place ID.")

    pdf.heading("14. Final Flow")
    pdf.bullet("Guest fills booking form.")
    pdf.bullet("Backend creates Razorpay order with safe server amount.")
    pdf.bullet("Guest pays with Razorpay.")
    pdf.bullet("Backend verifies Razorpay signature.")
    pdf.bullet("Backend saves confirmed booking to Google Sheets.")
    pdf.bullet("Website shows Booking Confirmed.")

    pdf.callout("Simple memory trick", "Frontend shows. Backend protects. Razorpay collects. Google Sheets records. Google Review link grows reputation. Google Map guides guests.")
    pdf.save(OUTPUT)


if __name__ == "__main__":
    build()
    print(OUTPUT.resolve())
