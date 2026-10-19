import { AUTOMATION_LABELS, FEATURE_LABELS } from "./db-data";

export type Fmt = "pg" | "fs" | "json";
export interface Parsed { F: Record<string, true>; A: Record<string, true>; ty: "s" | "d" | "m"; fmt: Fmt; db: string; ok: boolean }
export interface Table { n: string; w: string; f: string[] }
export interface Field { c: string; nl: boolean; u: boolean; t: string; ref?: string }

export function parseReport(txt: string): Parsed {
  const items = new Set<string>();
  txt.split("\n").forEach((l) => { l = l.trim(); if (l.startsWith("-")) items.add(l.slice(1).trim()); });
  const F: Record<string, true> = {}, A: Record<string, true> = {};
  for (const k in FEATURE_LABELS) if (items.has(FEATURE_LABELS[k])) F[k] = true;
  for (const k in AUTOMATION_LABELS) if (items.has(AUTOMATION_LABELS[k])) A[k] = true;
  const m = txt.match(/ধরন:\s*(\S+)/), d = txt.match(/ডাটাবেস:\s*(.+)/), db = d ? d[1] : "";
  const ty = m ? (m[1].startsWith("স্ট্যাটিক") ? "s" : m[1].startsWith("মার্কেট") ? "m" : "d") : "d";
  const fmt: Fmt = ty === "s" ? "json" : /Firestore/i.test(db) ? "fs" : /PostgreSQL/i.test(db) ? "pg" : /Sheet|JSON/i.test(db) ? "json" : "pg";
  return { F, A, ty, fmt, db, ok: !!(m || d || Object.keys(F).length) };
}

export function buildTables(p: Parsed, fmt: Fmt): Table[] {
  const F = p.F, A = p.A, M = p.ty === "m", fs = fmt === "fs", T: Table[] = [];
  const t = (n: string, w: string, f: string[]) => { T.push({ n, w, f }); };
  const any = (...k: string[]) => k.some((x) => F[x] || A[x]);
  t("categories", "পণ্যের ক্যাটাগরি", ["id id", "name text", "slug text!", "parent_id >categories?", "image_url text?", "sort_order int"]);
  if (p.ty === "s") {
    t("products", "পণ্যের তালিকা", ["id id", "name text", "slug text!", "description text?", "price num", "sale_price num?", "image_urls json", "category_id >categories", "in_stock bool"]);
    t("settings", "সাইটের সাধারণ তথ্য", ["id id", "shop_name text", "phone text", "whatsapp text", "address text?"]);
    if (F.faq) t("faqs", "সাধারণ প্রশ্ন ও উত্তর", ["id id", "question text", "answer text", "sort_order int"]);
    if (F.blog) t("posts", "ব্লগ পোস্ট", ["id id", "title text", "slug text!", "content text", "cover_url text?", "published_at ts"]);
    return T;
  }
  t("users", "গ্রাহক ও অ্যাডমিন", ["id id", "name text", "email text!?", "phone text!?", ...(fs ? ["auth_uid text!"] : ["password_hash text?"]), ...(any("social") ? ["auth_provider text"] : []), "role text", "created_at ts"]);
  if (M) t("vendors", "বিক্রেতার দোকান", ["id id", "user_id >users", "shop_name text", "slug text!", "commission_pct num", "status text", "created_at ts"]);
  t("products", "পণ্য", ["id id", "name text", "slug text!", "description text?", "price num", "sale_price num?", "image_urls json", "category_id >categories", "stock int", "is_active bool", "created_at ts", ...(M ? ["vendor_id >vendors"] : []), ...(F.pre ? ["is_preorder bool", "available_from ts?"] : []), ...(A.lowstock ? ["low_stock_alert int?"] : []), ...(A.social ? ["fb_posted_at ts?"] : [])]);
  if (F.var) t("product_variants", "সাইজ, রঙ ও আলাদা স্টক", ["id id", "product_id >products", "sku text!", "size text?", "color text?", "price num?", "stock int"]);
  if (F.profile) t("addresses", "সংরক্ষিত ঠিকানা", ["id id", "user_id >users", "label text", "address text", "district text", "phone text", "is_default bool"]);
  if (F.wish) t("wishlists", "উইশলিস্ট", ["id id", "user_id >users", "product_id >products", "created_at ts"]);
  if (F.coupon) t("coupons", "কুপন কোড", ["id id", "code text!", "type text", "value num", "min_order num?", "max_uses int?", "used_count int", "starts_at ts?", "ends_at ts?", "is_active bool"]);
  if (F.zone) t("shipping_zones", "এলাকাভিত্তিক ডেলিভারি চার্জ", ["id id", "name text", "districts json", "charge num", "free_over num?"]);
  if (F.flash) {
    t("flash_sales", "ফ্ল্যাশ সেলের ক্যাম্পেইন", ["id id", "title text", "starts_at ts", "ends_at ts"]);
    t("flash_sale_items", "সেলের পণ্য ও দাম", ["id id", "sale_id >flash_sales", "product_id >products", "sale_price num"]);
  }
  t("orders", "অর্ডার", ["id id", "order_no text!", "user_id >users?", "customer_name text", "phone text", "address text", "district text?", "subtotal num", "shipping_fee num", "discount num", "total num", "status text", "payment_method text", "payment_status text", "note text?", "created_at ts", ...(F.coupon ? ["coupon_id >coupons?"] : []), ...(F.adv ? ["advance_amount num"] : []), ...(F.inv ? ["invoice_no text!?"] : [])]);
  t("order_items", "অর্ডারের পণ্য", ["id id", "order_id >orders", "product_id >products", "name text", "price num", "qty int", ...(F.var ? ["variant_id >product_variants?"] : []), ...(M ? ["vendor_id >vendors"] : [])]);
  if (any("mfs", "card", "adv")) t("payments", "পেমেন্টের রেকর্ড", ["id id", "order_id >orders", "method text", "trx_id text?", "amount num", "status text", "paid_at ts?"]);
  if (any("track", "inbox", "courier")) t("order_status_history", "অর্ডারের অবস্থার ইতিহাস", ["id id", "order_id >orders", "status text", "note text?", "created_at ts"]);
  if (any("courier", "cbook")) t("shipments", "কুরিয়ার ও ট্র্যাকিং", ["id id", "order_id >orders", "courier text", "consignment_id text?", "tracking_code text?", "status text", "created_at ts"]);
  if (F.review) t("reviews", "রিভিউ ও রেটিং", ["id id", "product_id >products", "user_id >users", "rating int", "comment text?", "is_approved bool", "created_at ts"]);
  if (F.blog) t("posts", "ব্লগ পোস্ট", ["id id", "title text", "slug text!", "content text", "cover_url text?", "status text", "published_at ts?"]);
  if (F.faq) t("faqs", "সাধারণ প্রশ্ন ও পলিসি", ["id id", "question text", "answer text", "sort_order int"]);
  if (F.loyal) t("loyalty_ledger", "পয়েন্টের লেনদেন", ["id id", "user_id >users", "points int", "reason text", "order_id >orders?", "created_at ts"]);
  if (F.ref) t("referrals", "রেফারেল ও কমিশন", ["id id", "referrer_id >users", "code text!", "referred_user_id >users?", "order_id >orders?", "commission num", "status text"]);
  if (F.news) {
    t("subscribers", "নিউজলেটার সাবস্ক্রাইবার", ["id id", "email text!?", "phone text?", "is_active bool"]);
    t("campaigns", "ক্যাম্পেইন", ["id id", "channel text", "subject text?", "body text", "sent_at ts?"]);
  }
  if (F.bulk) t("import_jobs", "বাল্ক আপলোডের কাজ", ["id id", "file_name text", "status text", "rows_ok int", "rows_failed int", "created_at ts"]);
  if (F.roles) t("permissions", "রোলের অনুমতি", ["id id", "role text", "permission text"]);
  if (A.cart) t("carts", "কার্ট (রিমাইন্ডারের জন্য)", ["id id", "user_id >users?", "session_id text?", "items json", "updated_at ts", "reminded_at ts?"]);
  if (any("sms", "mail", "cart", "lowstock", "daily")) t("notification_logs", "পাঠানো SMS ও ইমেইলের লগ", ["id id", "channel text", "recipient text", "template text", "status text", "created_at ts"]);
  t("settings", "সাইটের সেটিংস", ["id id", "key text!", "value json"]);
  return T;
}

export function parseField(s: string): Field {
  const a = s.split(" ");
  let ty = a[1];
  const nl = ty.includes("?"), u = ty.includes("!");
  ty = ty.replace(/[!?]/g, "");
  return ty.startsWith(">") ? { c: a[0], nl, u, t: "ref", ref: ty.slice(1) } : { c: a[0], nl, u, t: ty };
}

export function toSql(T: Table[]): string {
  const m: Record<string, string> = { text: "text", int: "integer", num: "numeric(12,2)", bool: "boolean", ts: "timestamptz", json: "jsonb" };
  return T.map((x) => {
    const ix: string[] = [];
    const c = x.f.map((s) => {
      const f = parseField(s);
      if (f.t === "id") return "  id uuid PRIMARY KEY DEFAULT gen_random_uuid()";
      const ty = f.t === "ref" ? "uuid REFERENCES " + f.ref + "(id)" : m[f.t];
      if (f.t === "ref") ix.push("CREATE INDEX ON " + x.n + " (" + f.c + ");");
      let l = "  " + f.c + " " + ty;
      if (!f.nl) l += " NOT NULL";
      if (f.u) l += " UNIQUE";
      if (f.c === "created_at") l += " DEFAULT now()";
      return l;
    }).join(",\n");
    return "CREATE TABLE " + x.n + " (\n" + c + "\n);" + (ix.length ? "\n" + ix.join("\n") : "");
  }).join("\n\n");
}

export function toFirestore(T: Table[]): string {
  const m: Record<string, string> = { text: "string", int: "number", num: "number", bool: "boolean", ts: "timestamp", json: "map বা array" };
  return T.map((x) => {
    const f = x.f.map(parseField).filter((c) => c.t !== "id").map((c) => {
      let ty = c.t === "ref" ? "string" : m[c.t];
      if (c.nl) ty += " | null";
      if (c.t === "ref") ty += "   // " + c.ref + " ডকুমেন্টের ID";
      return "  " + c.c + ": " + ty;
    }).join("\n");
    return x.n + "/{id}\n{\n" + f + "\n}";
  }).join("\n\n");
}

export function toJson(T: Table[]): string {
  const vals: Record<string, unknown> = { id: 1, text: "নমুনা লেখা", int: 0, num: 0, bool: true, ts: "2026-01-01T00:00:00Z", json: [], ref: 1 };
  return T.map((x) => {
    const r: Record<string, unknown> = {};
    x.f.map(parseField).forEach((c) => { let v = vals[c.t]; if (c.t === "text" && /image|url/.test(c.c)) v = "images/sample.jpg"; r[c.c] = v; });
    return "// " + x.n + ".json\n" + JSON.stringify([r], null, 2);
  }).join("\n\n");
}

export const typeName = (f: Field) => f.t === "id" ? "ID" : f.t === "ref" ? "→ " + f.ref : ({ text: "লেখা", int: "পূর্ণ সংখ্যা", num: "দশমিক সংখ্যা", bool: "হ্যাঁ/না", ts: "তারিখ ও সময়", json: "JSON" } as Record<string, string>)[f.t];

export function generateCode(T: Table[], fmt: Fmt) { return fmt === "pg" ? toSql(T) : fmt === "fs" ? toFirestore(T) : toJson(T); }

export function sampleSql(p: Parsed): string {
  const F = p.F, M = p.ty === "m", s = ["-- ১. নমুনা ক্যাটাগরি, পণ্য ও অর্ডার"];
  if (M) {
    s.push("INSERT INTO users (name,email,role) VALUES ('নমুনা বিক্রেতা','vendor@example.com','vendor');");
    s.push("INSERT INTO vendors (user_id,shop_name,slug,commission_pct,status) VALUES ((SELECT id FROM users WHERE email='vendor@example.com'),'নমুনা দোকান','sample-shop',10,'active');");
  }
  const vc = M ? ",vendor_id" : "", vv = M ? ",(SELECT id FROM vendors WHERE slug='sample-shop')" : "", pc = F.pre ? ",is_preorder" : "", pv = F.pre ? ",false" : "", oc = F.adv ? ",advance_amount" : "", ov = F.adv ? ",0" : "";
  s.push("INSERT INTO categories (name,slug,sort_order) VALUES ('নমুনা ক্যাটাগরি','sample-category',1);");
  s.push("INSERT INTO products (name,slug,price,image_urls,category_id,stock,is_active" + vc + pc + ") VALUES ('নমুনা পণ্য','sample-product',500,'[]',(SELECT id FROM categories WHERE slug='sample-category'),10,true" + vv + pv + ");");
  s.push("INSERT INTO orders (order_no,customer_name,phone,address,subtotal,shipping_fee,discount,total,status,payment_method,payment_status" + oc + ") VALUES ('ORD-1001','নমুনা গ্রাহক','01700000000','ঢাকা',500,60,0,560,'pending','cod','unpaid'" + ov + ");");
  s.push("INSERT INTO order_items (order_id,product_id,name,price,qty" + vc + ") VALUES ((SELECT id FROM orders WHERE order_no='ORD-1001'),(SELECT id FROM products WHERE slug='sample-product'),'নমুনা পণ্য',500,1" + vv + ");");
  s.push("", "-- ২. পরীক্ষা: প্রতিটি কোয়েরি আলাদাভাবে Run করে দেখুন", "SELECT * FROM products;", "SELECT o.order_no, p.name, i.qty, i.price FROM orders o JOIN order_items i ON i.order_id=o.id JOIN products p ON p.id=i.product_id;", "SELECT c.name, COUNT(*) AS total FROM products p JOIN categories c ON c.id=p.category_id GROUP BY c.name;");
  return s.join("\n");
}

/* ───── ER diagram layout ───── */
export interface ErdBox { n: string; x: number; y: number; h: number; keys: { pk: boolean; c: string }[]; more: number }
export interface ErdLine { x1: number; y1: number; x2: number; y2: number }
export const ERD_W = 190;

function clip(c: { x: number; y: number }, d: { x: number; y: number }, w: number, h: number) {
  const dx = d.x - c.x, dy = d.y - c.y, k = 1 / Math.max(Math.abs(dx) / (w / 2), Math.abs(dy) / (h / 2), 1e-6);
  return { x: c.x + dx * k, y: c.y + dy * k };
}

export function layoutErd(T: Table[]) {
  const W = ERD_W, G = 26, C = 4, pos: Record<string, ErdBox> = {}, ys = [10];
  const meta = T.map((t) => { const f = t.f.map(parseField), k = f.filter((c) => c.t === "id" || c.t === "ref"); return { t, f, k, mm: f.length - k.length }; });
  for (let i = 0; i < meta.length; i += C) {
    let mh = 0;
    for (let j = i; j < Math.min(i + C, meta.length); j++) {
      const { t, k, mm } = meta[j], h = 36 + 17 * k.length + (mm ? 17 : 0);
      pos[t.n] = { n: t.n, x: 10 + (j - i) * (W + G), y: ys[ys.length - 1], h, keys: k.map((c) => ({ pk: c.t === "id", c: c.c })), more: mm };
      mh = Math.max(mh, h);
    }
    ys.push(ys[ys.length - 1] + mh + 36);
  }
  const lines: ErdLine[] = [];
  meta.forEach(({ t, f }) => {
    const a = pos[t.n];
    f.forEach((c) => {
      const b = c.ref ? pos[c.ref] : undefined;
      if (c.ref && b && c.ref !== t.n) {
        const ca = { x: a.x + W / 2, y: a.y + a.h / 2 }, cb = { x: b.x + W / 2, y: b.y + b.h / 2 };
        const p1 = clip(ca, cb, W, a.h), p2 = clip(cb, ca, W, b.h);
        lines.push({ x1: p1.x, y1: p1.y, x2: p2.x, y2: p2.y });
      }
    });
  });
  return { vw: 20 + C * W + (C - 1) * G, vh: ys[ys.length - 1], boxes: meta.map((m) => pos[m.t.n]), lines };
}

/* ───── Data-flow / journeys ───── */
export function flows(p: Parsed) {
  if (p.ty === "s") return null;
  const F = p.F, A = p.A, c = ["পণ্য দেখা|products, categories"], ex: string[] = [];
  if (F.search) c.push("খোঁজা ও ফিল্টার|products");
  if (F.login) c.push("লগইন|users");
  c.push("কার্টে যোগ|ব্রাউজারে বা carts", "চেকআউট|orders, order_items");
  if (F.mfs || F.card || F.adv) c.push("পেমেন্ট|payments");
  if (F.track || F.courier) c.push("ডেলিভারি ও ট্র্যাকিং|" + (F.courier ? "shipments" : "order_status_history"));
  if (F.review) c.push("রিভিউ|reviews");
  const a = ["লগইন|users (role)", "পণ্য যোগ|products" + (F.var ? ", product_variants" : ""), "অর্ডার দেখা|orders", "স্ট্যাটাস বদল|" + (F.track || F.inbox || F.courier ? "order_status_history" : "orders")];
  if (F.courier || A.cbook) a.push("কুরিয়ার বুক|shipments");
  if (F.report) a.push("রিপোর্ট|orders থেকে হিসাব");
  if (F.mfs) ex.push("bKash/Nagad");
  if (F.courier || A.cbook) ex.push("কুরিয়ার API");
  if (A.sms) ex.push("SMS সেবা");
  if (A.mail) ex.push("ইমেইল সেবা");
  const fb = p.fmt === "fs";
  const data = ["গ্রাহক|ব্রাউজার", "ওয়েবসাইট|ফ্রন্টএন্ড", fb ? "Firebase|Auth ও Functions" : "ব্যাকএন্ড|API", "ডাটাবেস|" + (fb ? "Firestore" : "PostgreSQL"), "অ্যাডমিন প্যানেল|অর্ডার ও রিপোর্ট"];
  return { data, customer: c, admin: a, ex };
}
