export type OrgNode = {
  id: string
  name: string
  /** struktur = unit organisasi (bisa punya kantor); jabatan = posisi/jabatan */
  type: "struktur" | "jabatan"
  /** Nama kantor yang terhubung (hanya untuk struktur). */
  office?: string
  children: OrgNode[]
}

let seq = 1000
export const uid = () => `n${++seq}`

const j = (id: string, name: string, children: OrgNode[] = []): OrgNode => ({ id, name, type: "jabatan", children })
const s = (id: string, name: string, office: string | undefined, children: OrgNode[] = []): OrgNode => ({ id, name, type: "struktur", office, children })

export const offices = [
  "PT Biometrik Citra Dewata", "PT BBS Semarang", "PT BBS Banjarmasin",
  "PT Anugerah Selaras Bersama", "Kantor Solo Baru", "Kantor Jogjakarta", "Kantor Purwokerto",
]

/** Data contoh, mengikuti struktur di aplikasi lama. */
export const initialTree: OrgNode = s("root", "Demo Account", "PT Biometrik Citra Dewata", [
  j("a1", "CEO", [
    j("a2", "PT BW", [j("a3", "Asisten")]),
    j("a4", "Staff"),
    j("a5", "Staff", [j("a6", "staff")]),
  ]),
  j("b1", "Karyawan"),
  j("c1", "OWNER UTAMA", [j("c2", "Pegawai")]),
  s("d1", "PT.BBS-SMG", "PT BBS Semarang", [
    j("d2", "PIMPINAN", [j("d3", "SPV"), j("d4", "STAFF"), j("d5", "SALES KANVAS"), j("d6", "ADMIN SALES")]),
  ]),
  s("e1", "PT.BBS-BJM", "PT BBS Banjarmasin", [
    j("e2", "Direktur", [j("e3", "HOS"), j("e4", "Care Officer")]),
  ]),
  s("f1", "PT ANUGERAH SELARAS BERSAMA", "PT Anugerah Selaras Bersama", [
    j("f2", "Direksi"),
    s("f3", "Kantor Solo Baru", "Kantor Solo Baru", [j("f4", "Branch Manager", [j("f5", "Supervisor")])]),
  ]),
])

export function update(node: OrgNode, id: string, fn: (n: OrgNode) => OrgNode): OrgNode {
  if (node.id === id) return fn(node)
  return { ...node, children: node.children.map((c) => update(c, id, fn)) }
}

export const addChild = (tree: OrgNode, parentId: string, child: OrgNode) =>
  update(tree, parentId, (n) => ({ ...n, children: [...n.children, child] }))

export function remove(node: OrgNode, id: string): OrgNode {
  return { ...node, children: node.children.filter((c) => c.id !== id).map((c) => remove(c, id)) }
}

export function walk(node: OrgNode, fn: (n: OrgNode, depth: number) => void, depth = 0) {
  fn(node, depth)
  node.children.forEach((c) => walk(c, fn, depth + 1))
}

export const countDescendants = (node: OrgNode): number =>
  node.children.reduce((n, c) => n + 1 + countDescendants(c), 0)

/** Pohon yang hanya berisi node yang cocok dengan `q` beserta induknya. */
export function filter(node: OrgNode, q: string): OrgNode | null {
  const kids = node.children.map((c) => filter(c, q)).filter((c): c is OrgNode => c !== null)
  if (node.name.toLowerCase().includes(q) || kids.length > 0) return { ...node, children: kids }
  return null
}

export function stats(tree: OrgNode) {
  let struktur = 0, jabatan = 0
  const office = new Set<string>()
  walk(tree, (n) => {
    if (n.type === "struktur") { struktur++; if (n.office) office.add(n.office) } else jabatan++
  })
  return { struktur, jabatan, kantor: office.size }
}
