"use client";
import { useState } from "react";
import { ChevronRight, Layers, Square } from "lucide-react";

// Recursive row renderer. `depth` controls left-indent so nested groups
// stack visibly. Each row click selects the node on canvas; double-click on
// a group enters group-edit mode (children become individually selectable).
function LayerRow({
  node,
  depth,
  allNodes,
  selectedIds,
  editingGroupId,
  expandedGroupIds,
  onToggleExpand,
  onSelect,
  onEnterGroup,
}) {
  const isGroup = node.type === "group";
  const selected = selectedIds.has(node.id);
  const editing = editingGroupId === node.id;
  const expanded = expandedGroupIds.has(node.id);
  const children = isGroup
    ? (node.children || [])
        .map((cid) => allNodes.find((n) => n.id === cid))
        .filter(Boolean)
    : [];

  return (
    <>
      <div
        role="button"
        tabIndex={0}
        onClick={(e) => onSelect(node.id, e.shiftKey)}
        onDoubleClick={(e) => {
          e.stopPropagation();
          if (isGroup) onEnterGroup(node.id);
        }}
        className={`flex items-center gap-1.5 pr-2 h-7 rounded-md cursor-pointer cn-press ${
          selected
            ? "bg-cn-accent-soft text-cn-accent"
            : "text-cn-text-secondary hover:bg-cn-elevated hover:text-cn-text-primary"
        } ${editing ? "ring-1 ring-inset ring-[var(--cn-accent-ring)]" : ""}`}
        style={{
          paddingLeft: 6 + depth * 12,
          transition: "background-color var(--cn-dur-snappy), color var(--cn-dur-snappy), box-shadow var(--cn-dur-normal)",
        }}
        title={isGroup ? "Double-click to enter group" : node.name}
      >
        {isGroup ? (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onToggleExpand(node.id);
            }}
            className="w-3.5 h-3.5 flex items-center justify-center shrink-0 hover:text-cn-text-primary"
            style={{
              transition: "transform var(--cn-dur-snappy) var(--cn-ease-spring)",
              transform: expanded ? "rotate(90deg)" : "rotate(0deg)",
            }}
            aria-label={expanded ? "Collapse group" : "Expand group"}
          >
            <ChevronRight className="w-3 h-3" />
          </button>
        ) : (
          <div className="w-3.5 shrink-0" />
        )}
        {isGroup ? (
          <Layers className={`w-3 h-3 shrink-0 ${selected ? "text-cn-accent" : "text-cn-text-muted"}`} />
        ) : (
          <Square className={`w-3 h-3 shrink-0 ${selected ? "text-cn-accent" : "text-cn-text-muted"}`} />
        )}
        <span className="text-[11px] truncate flex-1 font-medium">
          {node.name}
        </span>
        {isGroup && (
          <span className="cn-mono-meta shrink-0">
            {node.autolayout?.direction === "row" ? "→" : "↓"}
            {(node.children || []).length}
          </span>
        )}
      </div>
      {isGroup && expanded &&
        children.map((c) => (
          <LayerRow
            key={c.id}
            node={c}
            depth={depth + 1}
            allNodes={allNodes}
            selectedIds={selectedIds}
            editingGroupId={editingGroupId}
            expandedGroupIds={expandedGroupIds}
            onToggleExpand={onToggleExpand}
            onSelect={onSelect}
            onEnterGroup={onEnterGroup}
          />
        ))}
    </>
  );
}

// Layer panel — Figma-style hierarchical view of every node on the canvas.
// Top-level entries are nodes whose `parent` is null; groups expand to show
// their children indented. Double-click a group row to enter it.
export default function LayerPanel({
  nodes,
  selectedNodeIds,
  editingGroupId,
  onSelect,
  onEnterGroup,
}) {
  // Auto-expand any group containing a selected child so the selection is
  // visible by default. Plus user-managed expand/collapse via chevron click.
  const [userExpanded, setUserExpanded] = useState(() => new Set());
  const autoExpanded = new Set();
  for (const n of nodes) {
    if (n.parent && selectedNodeIds.has(n.id)) autoExpanded.add(n.parent);
    if (editingGroupId === n.id) autoExpanded.add(n.id);
  }
  const expandedGroupIds = new Set([...userExpanded, ...autoExpanded]);

  const toggleExpand = (id) => {
    setUserExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  // Top-level = no parent. Reverse iteration so the most recently added
  // node sits at the top of the list (matches Figma layer stack convention).
  const topLevel = nodes.filter((n) => !n.parent).slice().reverse();

  if (topLevel.length === 0) {
    return (
      <div className="p-6 flex flex-col items-center text-center gap-2 cn-anim-fade">
        <div className="w-8 h-8 rounded-md bg-cn-elevated flex items-center justify-center">
          <Layers className="w-3.5 h-3.5 text-cn-text-muted" />
        </div>
        <div className="cn-caption">Canvas is empty</div>
        <div className="cn-mono-meta">add from Components tab</div>
      </div>
    );
  }

  return (
    <div className="py-2 px-2 space-y-0.5 cn-anim-stagger">
      {topLevel.map((n) => (
        <LayerRow
          key={n.id}
          node={n}
          depth={0}
          allNodes={nodes}
          selectedIds={selectedNodeIds}
          editingGroupId={editingGroupId}
          expandedGroupIds={expandedGroupIds}
          onToggleExpand={toggleExpand}
          onSelect={onSelect}
          onEnterGroup={onEnterGroup}
        />
      ))}
    </div>
  );
}
