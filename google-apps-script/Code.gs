/**
 * رجّع وقتك — استقبال رسائل التواصل والتطوّع وحفظها في Google Sheet.
 * type = "contact"   -> تبويب Contacts
 * type = "volunteer" -> تبويب Volunteers
 *
 * الإعداد:
 * 1) حط الـ ID بتاع الشيت في SHEET_ID (من رابط الشيت بين /d/ و /edit).
 * 2) (اختياري) حط إيميلك في NOTIFY_EMAIL.
 * 3) Script Properties: SHARED_TOKEN = نفس CONTACT_SHARED_TOKEN على Vercel.
 * 4) اختار "setup" من القائمة فوق -> Run -> وافِق على الصلاحيات.
 * 5) Deploy -> Manage deployments -> Edit -> New version -> Deploy.
 */

var SHEET_ID = "ضع_هنا_الـID_بتاع_الشيت";
var NOTIFY_EMAIL = ""; // مثال: "you@gmail.com" — سيبه فاضي لو مش عايز إشعارات

function setup() {
  getSheet("contact");
  getSheet("volunteer");
  Logger.log("تمام - التبويبات جاهزة");
}

function doPost(e) {
  try {
    var expected = PropertiesService.getScriptProperties().getProperty("SHARED_TOKEN");
    var data = JSON.parse((e && e.postData && e.postData.contents) || "{}");

    if (!expected || data.token !== expected) {
      return json({ ok: false, error: "unauthorized" });
    }

    var type = data.type === "volunteer" ? "volunteer" : "contact";
    var name = String(data.name || "").trim();
    var email = String(data.email || "").trim();
    var phone = String(data.phone || "").trim();
    var city = String(data.city || "").trim();
    var interest = String(data.interest || "").trim();
    var message = String(data.message || "").trim();

    if (name.length < 2) {
      return json({ ok: false, error: "invalid" });
    }

    var sheet = getSheet(type);
    if (type === "volunteer") {
      sheet.appendRow([new Date(), name, email, phone, city, interest, message]);
    } else {
      sheet.appendRow([new Date(), name, email, phone, message]);
    }

    if (NOTIFY_EMAIL) {
      var subject = (type === "volunteer" ? "طلب تطوّع جديد - " : "رسالة تواصل جديدة - ") + name;
      var body = "النوع: " + type + "\nالاسم: " + name + "\nالبريد: " + (email || "-") + "\nالهاتف: " + (phone || "-");
      if (type === "volunteer") {
        body += "\nالمدينة: " + (city || "-") + "\nالمجال: " + (interest || "-");
      }
      body += "\n\nالرسالة:\n" + (message || "-");
      MailApp.sendEmail({ to: NOTIFY_EMAIL, subject: subject, replyTo: email || "", body: body });
    }

    return json({ ok: true });
  } catch (err) {
    return json({ ok: false, error: String(err) });
  }
}

function getSheet(type) {
  var name = type === "volunteer" ? "Volunteers" : "Contacts";
  var headers = type === "volunteer"
    ? ["التاريخ", "الاسم", "البريد", "الهاتف", "المدينة", "المجال", "الرسالة"]
    : ["التاريخ", "الاسم", "البريد", "الهاتف", "الرسالة"];

  var useId = SHEET_ID && SHEET_ID.indexOf("ضع_هنا") === -1;
  var ss = useId ? SpreadsheetApp.openById(SHEET_ID) : SpreadsheetApp.getActiveSpreadsheet();

  var sheet = ss.getSheetByName(name);
  if (!sheet) {
    sheet = ss.insertSheet(name);
    sheet.appendRow(headers);
  }
  return sheet;
}

function json(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}
