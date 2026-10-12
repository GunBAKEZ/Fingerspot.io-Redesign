import { Building2, ChevronRight, MoreHorizontal, Network, Pencil, Plus, Trash2, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import type { OrgNode } from "@/lib/org-tree"
import { cn } from "@/lib/utils"

export type NodeAction =
  | { kind: "add"; parent: OrgNode; nodeType: "struktur" | "jabatan"; withOffice?: boolean }
  | { kind: "rename"; node: OrgNode }
  | { kind: "office"; node: OrgNode }
  | { kind: "delete"; node: OrgNode }

function Highlight({ text, q }: { text: string; q: string }) {
  const i = q ? text.toLowerCase().indexOf(q) : -1
  if (i < 0) return <>{text}</>
  return <>{text.slice(0, i)}<mark className="rounded bg-warning/30 px-0.5 text-inherit">{text.slice(i, i + q.length)}</mark>{text.slice(i + q.length)}</>
}

/** Satu baris pohon (rekursif). Aksi: tambah (+), ubah (✎), hapus (🗑). */
export function OrgTreeNode({
  node, isRoot = false, q, expanded, onToggle, onAction,
}: {
  node: OrgNode
  isRoot?: boolean
  q: string
  expanded: Set<string>
  onToggle: (id: string) => void
  onAction: (a: NodeAction) => void
}) {
  const hasKids = node.children.length > 0
  const open = hasKids && (q !== "" || expanded.has(node.id))
  const struktur = node.type === "struktur"
  const Icon = struktur ? Network : User

  return (
    <li role="treeitem" aria-expanded={hasKids ? open : undefined} aria-label={node.name}>
      <div className="group flex items-center gap-1 rounded-xl py-0.5 pr-1 transition-colors hover:bg-primary-soft/70">
        {hasKids ? (
          <Button variant="ghost" size="icon-sm" className="size-7 shrink-0" aria-label={open ? `Ciutkan ${node.name}` : `Perluas ${node.name}`} onClick={() => onToggle(node.id)}>
            <ChevronRight className={cn("transition-transform", open && "rotate-90")} />
          </Button>
        ) : (
          <span className="size-7 shrink-0" />
        )}
        <Icon className={cn("size-4 shrink-0", struktur ? "text-primary" : "text-muted-foreground")} />
        <span className={cn("min-w-0 flex-1 truncate px-1.5 text-sm", struktur && "font-semibold")}>
          <Highlight text={node.name} q={q} />
        </span>

        {struktur && node.office && (
          <Tooltip>
            <TooltipTrigger asChild>
              <span className="grid size-7 shrink-0 place-items-center text-muted-foreground" aria-label={`Kantor: ${node.office}`}><Building2 className="size-4" /></span>
            </TooltipTrigger>
            <TooltipContent>{node.office}</TooltipContent>
          </Tooltip>
        )}

        {/* Layar lebar: tombol aksi langsung */}
        <div className="hidden items-center sm:flex">
          {/* Tambah */}
          {struktur ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon-sm" className="size-7 text-foreground" aria-label={`Tambah di ${node.name}`}><Plus /></Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-44">
                <DropdownMenuItem onSelect={() => onAction({ kind: "add", parent: node, nodeType: "struktur" })}>Tambah Struktur</DropdownMenuItem>
                <DropdownMenuItem onSelect={() => onAction({ kind: "add", parent: node, nodeType: "jabatan" })}>Tambah Jabatan</DropdownMenuItem>
                <DropdownMenuItem onSelect={() => onAction({ kind: "add", parent: node, nodeType: "struktur", withOffice: true })}>Tambah Kantor</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button variant="ghost" size="icon-sm" className="size-7 text-foreground" aria-label={`Tambah jabatan di ${node.name}`} onClick={() => onAction({ kind: "add", parent: node, nodeType: "jabatan" })}><Plus /></Button>
          )}

          {/* Ubah */}
          {struktur ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon-sm" className="size-7 text-foreground" aria-label={`Ubah ${node.name}`}><Pencil /></Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-44">
                <DropdownMenuItem onSelect={() => onAction({ kind: "rename", node })}>Ubah Struktur</DropdownMenuItem>
                <DropdownMenuItem onSelect={() => onAction({ kind: "office", node })}>{node.office ? "Ubah Kantor" : "Tambah Kantor"}</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button variant="ghost" size="icon-sm" className="size-7 text-foreground" aria-label={`Ubah ${node.name}`} onClick={() => onAction({ kind: "rename", node })}><Pencil /></Button>
          )}

          {/* Hapus (akar tidak bisa dihapus) */}
          {isRoot ? (
            <span className="size-7 shrink-0" />
          ) : (
            <Button variant="ghost" size="icon-sm" className="size-7 text-muted-foreground hover:text-danger" aria-label={`Hapus ${node.name}`} onClick={() => onAction({ kind: "delete", node })}><Trash2 /></Button>
          )}
        </div>

        {/* Layar kecil: semua aksi dalam satu menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon-sm" className="size-7 shrink-0 sm:hidden" aria-label={`Aksi untuk ${node.name}`}><MoreHorizontal /></Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            {struktur ? (
              <>
                <DropdownMenuItem onSelect={() => onAction({ kind: "add", parent: node, nodeType: "struktur" })}>Tambah Struktur</DropdownMenuItem>
                <DropdownMenuItem onSelect={() => onAction({ kind: "add", parent: node, nodeType: "jabatan" })}>Tambah Jabatan</DropdownMenuItem>
                <DropdownMenuItem onSelect={() => onAction({ kind: "add", parent: node, nodeType: "struktur", withOffice: true })}>Tambah Kantor</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onSelect={() => onAction({ kind: "rename", node })}>Ubah Struktur</DropdownMenuItem>
                <DropdownMenuItem onSelect={() => onAction({ kind: "office", node })}>{node.office ? "Ubah Kantor" : "Tambah Kantor"}</DropdownMenuItem>
              </>
            ) : (
              <>
                <DropdownMenuItem onSelect={() => onAction({ kind: "add", parent: node, nodeType: "jabatan" })}>Tambah Jabatan</DropdownMenuItem>
                <DropdownMenuItem onSelect={() => onAction({ kind: "rename", node })}>Ubah Jabatan</DropdownMenuItem>
              </>
            )}
            {!isRoot && (
              <>
                <DropdownMenuSeparator />
                <DropdownMenuItem variant="destructive" onSelect={() => onAction({ kind: "delete", node })}>Hapus</DropdownMenuItem>
              </>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {open && (
        <ul role="group" className="ml-3 border-l border-dashed border-border pl-2 sm:ml-[18px] sm:pl-3">
          {node.children.map((c) => (
            <OrgTreeNode key={c.id} node={c} q={q} expanded={expanded} onToggle={onToggle} onAction={onAction} />
          ))}
        </ul>
      )}
    </li>
  )
}
