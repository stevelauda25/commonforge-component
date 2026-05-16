"use client";
import { useState } from "react";
import { ChevronDown, ChevronRight, Layers, Square } from "lucide-react";

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
        className={`flex items-center gap-1 pr-2 py-1 rounded-sm cursor-pointer transition-colors ${
          selected
            ? "bg-blue-500/20 text-blue-300"
            : "text-neutral-300 hover:bg-neutral-800/60"
        } ${editing ? "ring-1 ring-inset ring-blue-400/50" : ""}`}
        style={{ paddingLeft: 6 + depth * 12 }}
        title={isGroup ? "Double-click to enter group" : node.name}
      >
        {isGroup ? (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onToggleExpand(node.id);
            }}
            className="p-0.5 hover:bg-neutral-700/60 rounded shrink-0"
            aria-label={expanded ? "Collapse group" : "Expand group"}
          >
            {expanded ? (
              <ChevronDown className="w-3 h-3" />
            ) : (
              <ChevronRight className="w-3 h-3" />
            )}
          </button>
        ) : (
          <div className="w-4 shrink-0" />
        )}
        {isGroup ? (
          <Layers className="w-3 h-3 shrink-0 text-blue-400" />
        ) : (
          <Square className="w-3 h-3 shrink-0 text-neutral-500" />
        )}
        <span className="text-[11px] truncate flex-1 font-medium">
          {node.name}
        </span>
        {isGroup && (
          <span className="text-[9px] font-mono text-neutral-500 shrink-0">
            {node.autolayout?.direction === "row" ? "→" : "↓"}
            {" "}
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
      <div className="p-4 text-[11px] text-neutral-500">
        Canvas is empty. Add a component from the Components tab.
      </div>
    );
  }

  return (
    <div className="py-2 px-2 space-y-0.5">
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
