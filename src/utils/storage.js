const STORAGE_KEY = 'lc_saved_presets_v1';

/**
 * Retrieve all saved presets from localStorage
 * @returns {Array} Array of saved items
 */
export function getSavedItems() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (e) {
    console.error('Failed to load saved items from localStorage:', e);
    return [];
  }
}

/**
 * Save or update an item in localStorage
 * @param {Object} item - { id?, name, type: 'token' | 'tracker', category?, data }
 * @returns {Array} Updated array of saved items
 */
export function saveItem(item) {
  const items = getSavedItems();
  const now = new Date().toISOString();

  let updatedItems;
  if (item.id) {
    const existingIndex = items.findIndex((i) => i.id === item.id);
    if (existingIndex >= 0) {
      items[existingIndex] = {
        ...items[existingIndex],
        ...item,
        updatedAt: now
      };
      updatedItems = [...items];
    } else {
      updatedItems = [{ ...item, createdAt: now, updatedAt: now }, ...items];
    }
  } else {
    const newItem = {
      id: 'preset_' + Date.now().toString(36) + '_' + Math.random().toString(36).substr(2, 5),
      name: item.name || (item.type === 'token' ? 'Unnamed Token' : 'Unnamed Tracker'),
      type: item.type || 'token',
      category: item.category || (item.data && item.data.category) || 'land',
      createdAt: now,
      updatedAt: now,
      data: item.data
    };
    updatedItems = [newItem, ...items];
  }

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedItems));
  } catch (e) {
    console.error('Failed to save item to localStorage:', e);
    alert('Failed to save to local storage. Your storage space might be full.');
  }

  return updatedItems;
}

/**
 * Delete an item from localStorage by ID
 * @param {string} id
 * @returns {Array} Updated array of saved items
 */
export function deleteItem(id) {
  const items = getSavedItems();
  const filtered = items.filter((item) => item.id !== id);
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
  } catch (e) {
    console.error('Failed to update localStorage after delete:', e);
  }
  return filtered;
}

/**
 * Export items array or all stored items as a downloadable JSON file
 * @param {Array} [itemsToExport]
 * @param {string} [filename]
 */
export function exportAllItemsToJSON(itemsToExport = null, filename = 'lc_presets_config.json') {
  const items = itemsToExport || getSavedItems();
  const exportPayload = {
    app: 'Littoral Commander Suite',
    version: '1.0',
    exportDate: new Date().toISOString(),
    items
  };

  const jsonString = JSON.stringify(exportPayload, null, 2);
  const blob = new Blob([jsonString], { type: 'application/json' });
  const url = URL.createObjectURL(blob);

  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/**
 * Import items from a JSON string into localStorage
 * @param {string} jsonString
 * @returns {{ success: boolean, count: number, items: Array, error?: string }}
 */
export function importItemsFromJSON(jsonString) {
  try {
    const parsed = JSON.parse(jsonString);
    let newItems = [];

    if (Array.isArray(parsed)) {
      newItems = parsed;
    } else if (parsed && Array.isArray(parsed.items)) {
      newItems = parsed.items;
    } else if (parsed && typeof parsed === 'object' && parsed.type && parsed.data) {
      newItems = [parsed];
    } else {
      return { success: false, count: 0, items: getSavedItems(), error: 'Invalid file format. Expected a preset configuration JSON.' };
    }

    const currentItems = getSavedItems();
    let importedCount = 0;

    const mergedItems = [...currentItems];

    newItems.forEach((newItem) => {
      if (!newItem.type || !newItem.data) return;

      const itemToImport = {
        id: 'preset_' + Date.now().toString(36) + '_' + Math.random().toString(36).substr(2, 5),
        name: newItem.name || 'Imported Preset',
        type: newItem.type,
        category: newItem.category || (newItem.data && newItem.data.category) || 'land',
        createdAt: newItem.createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        data: newItem.data
      };

      mergedItems.unshift(itemToImport);
      importedCount++;
    });

    localStorage.setItem(STORAGE_KEY, JSON.stringify(mergedItems));
    return { success: true, count: importedCount, items: mergedItems };
  } catch (e) {
    console.error('Failed to import items from JSON:', e);
    return { success: false, count: 0, items: getSavedItems(), error: e.message || 'Failed to parse JSON file' };
  }
}
