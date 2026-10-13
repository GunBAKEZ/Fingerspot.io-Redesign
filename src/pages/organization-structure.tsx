import { useMemo, useState } from "react"
import { ChevronsDownUp, ChevronsUpDown, SearchX, Search } from "lucide-react"
import { PageHeader } from "@/components/dashboard/page-header"
import { NodeDialog } from "@/components/organization/node-dialog"
import { OrgTreeNode, type NodeAction } from "@/components/organization/org-tree"
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription,
  AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardAction, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty"
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group"
import { addChild, countDescendants, filter, initialTree, remove, stats, uid, update, walk, type OrgNode } from "@/lib/org-tree"

const allParents = (tree: OrgNode) => { const ids = new Set<string>(); walk(tree, (n) => { if (n.children.length) ids.add(n.id) }); return ids }

export default function OrganizationStructure() {
  const [tree, setTree] = useState<OrgNode>(initialTree)
  const [expanded, setExpanded] = useState<Set<string>>(() => allParents(initialTree))
  const [query, setQuery] = useState("")
  const [form, setForm] = useState<Exclude<NodeAction, { kind: "delete" }> | null>(null)
  const [deleting, setDeleting] = useState<OrgNode | null>(null)

  const q = query.trim().toLowerCase()
  const visible = useMemo(() => (q ? filter(tree, q) : tree), [tree, q])
  const summary = useMemo(() => stats(tree), [tree])

  const toggle = (id: string) => setExpanded((e) => { const n = new Set(e); n.has(id) ? n.delete(id) : n.add(id); return n })
  const onAction = (a: NodeAction) => (a.kind === "delete" ? setDeleting(a.node) : setForm(a))

  const submit = (a: Exclude<NodeAction, { kind: "delete" }>, v: { name: string; office?: string }) => {
    if (a.kind === "add") {
      const child: OrgNode = { id: uid(), name: v.name, type: a.nodeType, office: a.nodeType === "struktur" ? v.office : undefined, children: [] }
      setTree((t) => addChild(t, a.parent.id, child))
      setExpanded((e) => new Set(e).add(a.parent.id))
    } else if (a.kind === "rename") {
      setTree((t) => update(t, a.node.id, (n) => ({ ...n, name: v.name })))
    } else {
      setTree((t) => update(t, a.node.id, (n) => ({ ...n, office: v.office })))
    }
    setForm(null)
  }

  const confirmDelete = () => {
    if (deleting) setTree((t) => remove(t, deleting.id))
    setDeleting(null)
  }

  return (
    <>
      <PageHeader crumbs={[{ label: "Organisasi" }, { label: "Struktur Organisasi" }]}>Struktur Organisasi</PageHeader>

      <Card>
        <CardHeader>
          <CardTitle>Susunan <span>organisasi</span></CardTitle>
          <CardAction className="hidden flex-wrap justify-end gap-2 sm:flex">
            <Badge variant="muted">{summary.struktur} struktur</Badge>
            <Badge variant="muted">{summary.jabatan} jabatan</Badge>
            <Badge variant="muted">{summary.kantor} kantor</Badge>
          </CardAction>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="flex flex-wrap items-center gap-3">
            <InputGroup className="h-10 max-w-sm flex-1 rounded-xl bg-background">
              <InputGroupAddon><Search /></InputGroupAddon>
              <InputGroupInput placeholder="Cari struktur atau jabatan…" value={query} onChange={(e) => setQuery(e.target.value)} />
            </InputGroup>
            <Button variant="outline" size="sm" onClick={() => setExpanded(allParents(tree))}><ChevronsUpDown /> Perluas semua</Button>
            <Button variant="outline" size="sm" onClick={() => setExpanded(new Set(["root"]))}><ChevronsDownUp /> Ciutkan semua</Button>
          </div>

          {visible ? (
            <ul role="tree" aria-label="Struktur organisasi" className="rounded-xl border p-2">
              <OrgTreeNode node={visible} isRoot q={q} expanded={expanded} onToggle={toggle} onAction={onAction} />
            </ul>
          ) : (
            <Empty className="py-16">
              <EmptyHeader>
                <EmptyMedia variant="icon"><SearchX /></EmptyMedia>
                <EmptyTitle>Tidak ada hasil</EmptyTitle>
                <EmptyDescription>Tidak ada struktur atau jabatan yang cocok dengan “{query}”.</EmptyDescription>
              </EmptyHeader>
            </Empty>
          )}
        </CardContent>
      </Card>

      <NodeDialog action={form} onClose={() => setForm(null)} onSubmit={submit} />

      <AlertDialog open={!!deleting} onOpenChange={(o) => !o && setDeleting(null)}>
        <AlertDialogContent className="rounded-2xl">
          <AlertDialogHeader>
            <AlertDialogTitle>Hapus “{deleting?.name}”?</AlertDialogTitle>
            <AlertDialogDescription>
              {deleting && countDescendants(deleting) > 0
                ? `${countDescendants(deleting)} struktur/jabatan di bawahnya ikut terhapus. Tindakan ini tidak dapat dibatalkan.`
                : "Tindakan ini tidak dapat dibatalkan."}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Batal</AlertDialogCancel>
            <AlertDialogAction variant="destructive" onClick={confirmDelete}>Hapus</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
