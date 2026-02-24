/**
 * Frames Store
 * Manages frames state with Zustand
 * Structure matches database schema:
 * - products (product_id, name, base_price, category_type='FRAME', is_active)
 * - product_frames (product_id, bridge_width_mm, lens_width_mm, material, shape, total_width_mm)
 * - product_variants (variant_id, color_name, sale_price, sku, is_preorder, expected_availability, product_id)
 * - product_images (image_id, image_url, product_id, variant_id)
 */

import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

// Mock data matching database structure
const MOCK_FRAMES = [
  {
    product_id: 'frame-001-58cc-4372-a567-0e02b2c3d479',
    name: 'Kính Nhựa LILY 11958',
    base_price: 560000,
    category_type: 'FRAME',
    is_active: true,
    // product_frames fields
    bridge_width_mm: 18,
    lens_width_mm: 52,
    total_width_mm: 140,
    material: 'PLASTIC',
    shape: 'RECTANGLE',
    variants: [
      {
        variant_id: 'v-frm-001-001',
        color_name: 'White',
        sale_price: 560000,
        sku: 'FRM-11958-WHT',
        is_preorder: false,
        expected_availability: null,
      },
      {
        variant_id: 'v-frm-001-002',
        color_name: 'Gray',
        sale_price: 560000,
        sku: 'FRM-11958-GRY',
        is_preorder: false,
        expected_availability: null,
      },
    ],
    images: [
      {
        image_id: 'img-frm-001',
        image_url: 'https://images.unsplash.com/photo-1574258495973-f010dfbb5371?w=400&h=400&fit=crop',
        variant_id: null,
      },
    ],
  },
  {
    product_id: 'frame-002-58cc-4372-a567-0e02b2c3d479',
    name: 'Kính Nhựa Pha Kim Loại Càng Titan LILY 10195',
    base_price: 900000,
    category_type: 'FRAME',
    is_active: true,
    bridge_width_mm: 17,
    lens_width_mm: 54,
    total_width_mm: 145,
    material: 'PLASTIC_METAL',
    shape: 'RECTANGLE',
    badge: 'Bán chạy',
    variants: [
      {
        variant_id: 'v-frm-002-001',
        color_name: 'Black',
        sale_price: 900000,
        sku: 'FRM-10195-BLK',
        is_preorder: false,
        expected_availability: null,
      },
    ],
    images: [
      {
        image_id: 'img-frm-002',
        image_url: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=400&h=400&fit=crop',
        variant_id: null,
      },
    ],
  },
  {
    product_id: 'frame-003-58cc-4372-a567-0e02b2c3d479',
    name: 'Kính Nhựa Pha Kim Loại Càng Titan LILY 9831',
    base_price: 420000,
    category_type: 'FRAME',
    is_active: true,
    bridge_width_mm: 16,
    lens_width_mm: 50,
    total_width_mm: 135,
    material: 'PLASTIC_METAL',
    shape: 'OVAL',
    badge: 'New',
    variants: [
      {
        variant_id: 'v-frm-003-001',
        color_name: 'Black',
        sale_price: 420000,
        sku: 'FRM-9831-BLK',
        is_preorder: false,
        expected_availability: null,
      },
      {
        variant_id: 'v-frm-003-002',
        color_name: 'Gray',
        sale_price: 420000,
        sku: 'FRM-9831-GRY',
        is_preorder: false,
        expected_availability: null,
      },
    ],
    images: [
      {
        image_id: 'img-frm-003',
        image_url: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=400&h=400&fit=crop',
        variant_id: null,
      },
    ],
  },
  {
    product_id: 'frame-004-58cc-4372-a567-0e02b2c3d479',
    name: 'Kính Nhựa Pha Kim Loại Càng Titan LILY 941',
    base_price: 2000000,
    category_type: 'FRAME',
    is_active: true,
    bridge_width_mm: 18,
    lens_width_mm: 55,
    total_width_mm: 148,
    material: 'TITANIUM',
    shape: 'RECTANGLE',
    badge: 'Premium',
    variants: [
      {
        variant_id: 'v-frm-004-001',
        color_name: 'Black',
        sale_price: 2000000,
        sku: 'FRM-941-BLK',
        is_preorder: false,
        expected_availability: null,
      },
    ],
    images: [
      {
        image_id: 'img-frm-004',
        image_url: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&h=400&fit=crop',
        variant_id: null,
      },
    ],
  },
  {
    product_id: 'frame-005-58cc-4372-a567-0e02b2c3d479',
    name: 'Kính Nhựa Pha Kim Loại LILY 9156',
    base_price: 560000,
    category_type: 'FRAME',
    is_active: true,
    bridge_width_mm: 17,
    lens_width_mm: 52,
    total_width_mm: 140,
    material: 'PLASTIC_METAL',
    shape: 'CAT_EYE',
    variants: [
      {
        variant_id: 'v-frm-005-001',
        color_name: 'Black',
        sale_price: 560000,
        sku: 'FRM-9156-BLK',
        is_preorder: false,
        expected_availability: null,
      },
      {
        variant_id: 'v-frm-005-002',
        color_name: 'Brown',
        sale_price: 560000,
        sku: 'FRM-9156-BRN',
        is_preorder: false,
        expected_availability: null,
      },
    ],
    images: [
      {
        image_id: 'img-frm-005',
        image_url: 'https://images.unsplash.com/photo-1585386959984-a4155224a1ad?w=400&h=400&fit=crop',
        variant_id: null,
      },
    ],
  },
  {
    product_id: 'frame-006-58cc-4372-a567-0e02b2c3d479',
    name: 'Kính Nhựa Pha Kim Loại LILY 82022',
    base_price: 520000,
    category_type: 'FRAME',
    is_active: true,
    bridge_width_mm: 16,
    lens_width_mm: 51,
    total_width_mm: 138,
    material: 'PLASTIC_METAL',
    shape: 'RECTANGLE',
    variants: [
      {
        variant_id: 'v-frm-006-001',
        color_name: 'Dark Gray',
        sale_price: 520000,
        sku: 'FRM-82022-DGY',
        is_preorder: false,
        expected_availability: null,
      },
    ],
    images: [
      {
        image_id: 'img-frm-006',
        image_url: 'https://images.unsplash.com/photo-1574258495973-f010dfbb5371?w=400&h=400&fit=crop',
        variant_id: null,
      },
    ],
  },
  {
    product_id: 'frame-007-58cc-4372-a567-0e02b2c3d479',
    name: 'Kính Kim Loại LILY 7892',
    base_price: 750000,
    category_type: 'FRAME',
    is_active: true,
    bridge_width_mm: 19,
    lens_width_mm: 54,
    total_width_mm: 142,
    material: 'METAL',
    shape: 'ROUND',
    variants: [
      {
        variant_id: 'v-frm-007-001',
        color_name: 'Gold',
        sale_price: 750000,
        sku: 'FRM-7892-GLD',
        is_preorder: false,
        expected_availability: null,
      },
      {
        variant_id: 'v-frm-007-002',
        color_name: 'Silver',
        sale_price: 750000,
        sku: 'FRM-7892-SLV',
        is_preorder: false,
        expected_availability: null,
      },
    ],
    images: [
      {
        image_id: 'img-frm-007',
        image_url: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=400&h=400&fit=crop',
        variant_id: null,
      },
    ],
  },
  {
    product_id: 'frame-008-58cc-4372-a567-0e02b2c3d479',
    name: 'Kính Nhựa Cao Cấp LILY 6543',
    base_price: 680000,
    category_type: 'FRAME',
    is_active: true,
    bridge_width_mm: 17,
    lens_width_mm: 53,
    total_width_mm: 141,
    material: 'PLASTIC',
    shape: 'POLYGON',
    badge: 'New',
    variants: [
      {
        variant_id: 'v-frm-008-001',
        color_name: 'Black',
        sale_price: 680000,
        sku: 'FRM-6543-BLK',
        is_preorder: false,
        expected_availability: null,
      },
      {
        variant_id: 'v-frm-008-002',
        color_name: 'Tortoise',
        sale_price: 680000,
        sku: 'FRM-6543-TRT',
        is_preorder: false,
        expected_availability: null,
      },
    ],
    images: [
      {
        image_id: 'img-frm-008',
        image_url: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=400&h=400&fit=crop',
        variant_id: null,
      },
    ],
  },
  {
    product_id: 'frame-009-58cc-4372-a567-0e02b2c3d479',
    name: 'Kính Titan Siêu Nhẹ LILY 5432',
    base_price: 1500000,
    category_type: 'FRAME',
    is_active: true,
    bridge_width_mm: 18,
    lens_width_mm: 52,
    total_width_mm: 140,
    material: 'TITANIUM',
    shape: 'RECTANGLE',
    badge: 'Premium',
    variants: [
      {
        variant_id: 'v-frm-009-001',
        color_name: 'Gunmetal',
        sale_price: 1500000,
        sku: 'FRM-5432-GMT',
        is_preorder: false,
        expected_availability: null,
      },
    ],
    images: [
      {
        image_id: 'img-frm-009',
        image_url: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&h=400&fit=crop',
        variant_id: null,
      },
    ],
  },
  {
    product_id: 'frame-010-58cc-4372-a567-0e02b2c3d479',
    name: 'Kính Mắt Mèo LILY 4321',
    base_price: 490000,
    category_type: 'FRAME',
    is_active: true,
    bridge_width_mm: 16,
    lens_width_mm: 50,
    total_width_mm: 135,
    material: 'PLASTIC',
    shape: 'CAT_EYE',
    variants: [
      {
        variant_id: 'v-frm-010-001',
        color_name: 'Black',
        sale_price: 490000,
        sku: 'FRM-4321-BLK',
        is_preorder: false,
        expected_availability: null,
      },
      {
        variant_id: 'v-frm-010-002',
        color_name: 'Red',
        sale_price: 490000,
        sku: 'FRM-4321-RED',
        is_preorder: false,
        expected_availability: null,
      },
    ],
    images: [
      {
        image_id: 'img-frm-010',
        image_url: 'https://images.unsplash.com/photo-1585386959984-a4155224a1ad?w=400&h=400&fit=crop',
        variant_id: null,
      },
    ],
  },
  {
    product_id: 'frame-011-58cc-4372-a567-0e02b2c3d479',
    name: 'Kính Tròn Vintage LILY 3210',
    base_price: 580000,
    category_type: 'FRAME',
    is_active: true,
    bridge_width_mm: 20,
    lens_width_mm: 48,
    total_width_mm: 136,
    material: 'METAL',
    shape: 'ROUND',
    variants: [
      {
        variant_id: 'v-frm-011-001',
        color_name: 'Gold',
        sale_price: 580000,
        sku: 'FRM-3210-GLD',
        is_preorder: false,
        expected_availability: null,
      },
    ],
    images: [
      {
        image_id: 'img-frm-011',
        image_url: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=400&h=400&fit=crop',
        variant_id: null,
      },
    ],
  },
  {
    product_id: 'frame-012-58cc-4372-a567-0e02b2c3d479',
    name: 'Kính Đa Giác Trendy LILY 2109',
    base_price: 620000,
    category_type: 'FRAME',
    is_active: true,
    bridge_width_mm: 17,
    lens_width_mm: 51,
    total_width_mm: 138,
    material: 'PLASTIC_METAL',
    shape: 'POLYGON',
    badge: 'Hot',
    variants: [
      {
        variant_id: 'v-frm-012-001',
        color_name: 'Black',
        sale_price: 620000,
        sku: 'FRM-2109-BLK',
        is_preorder: false,
        expected_availability: null,
      },
      {
        variant_id: 'v-frm-012-002',
        color_name: 'Clear',
        sale_price: 620000,
        sku: 'FRM-2109-CLR',
        is_preorder: false,
        expected_availability: null,
      },
    ],
    images: [
      {
        image_id: 'img-frm-012',
        image_url: 'https://images.unsplash.com/photo-1574258495973-f010dfbb5371?w=400&h=400&fit=crop',
        variant_id: null,
      },
    ],
  },
  {
    product_id: 'frame-013-58cc-4372-a567-0e02b2c3d479',
    name: 'Kính Oval Classic LILY 1098',
    base_price: 450000,
    category_type: 'FRAME',
    is_active: true,
    bridge_width_mm: 18,
    lens_width_mm: 52,
    total_width_mm: 140,
    material: 'PLASTIC',
    shape: 'OVAL',
    variants: [
      {
        variant_id: 'v-frm-013-001',
        color_name: 'Brown',
        sale_price: 450000,
        sku: 'FRM-1098-BRN',
        is_preorder: false,
        expected_availability: null,
      },
    ],
    images: [
      {
        image_id: 'img-frm-013',
        image_url: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=400&h=400&fit=crop',
        variant_id: null,
      },
    ],
  },
  {
    product_id: 'frame-014-58cc-4372-a567-0e02b2c3d479',
    name: 'Kính Vuông Oversize LILY 9087',
    base_price: 720000,
    category_type: 'FRAME',
    is_active: true,
    bridge_width_mm: 19,
    lens_width_mm: 58,
    total_width_mm: 150,
    material: 'PLASTIC',
    shape: 'RECTANGLE',
    badge: 'Bán chạy',
    variants: [
      {
        variant_id: 'v-frm-014-001',
        color_name: 'Black',
        sale_price: 720000,
        sku: 'FRM-9087-BLK',
        is_preorder: false,
        expected_availability: null,
      },
      {
        variant_id: 'v-frm-014-002',
        color_name: 'Tortoise',
        sale_price: 720000,
        sku: 'FRM-9087-TRT',
        is_preorder: false,
        expected_availability: null,
      },
    ],
    images: [
      {
        image_id: 'img-frm-014',
        image_url: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&h=400&fit=crop',
        variant_id: null,
      },
    ],
  },
  {
    product_id: 'frame-015-58cc-4372-a567-0e02b2c3d479',
    name: 'Kính Kim Loại Siêu Mỏng LILY 8076',
    base_price: 850000,
    category_type: 'FRAME',
    is_active: true,
    bridge_width_mm: 17,
    lens_width_mm: 53,
    total_width_mm: 141,
    material: 'METAL',
    shape: 'RECTANGLE',
    variants: [
      {
        variant_id: 'v-frm-015-001',
        color_name: 'Silver',
        sale_price: 850000,
        sku: 'FRM-8076-SLV',
        is_preorder: false,
        expected_availability: null,
      },
      {
        variant_id: 'v-frm-015-002',
        color_name: 'Black',
        sale_price: 850000,
        sku: 'FRM-8076-BLK',
        is_preorder: false,
        expected_availability: null,
      },
    ],
    images: [
      {
        image_id: 'img-frm-015',
        image_url: 'https://images.unsplash.com/photo-1585386959984-a4155224a1ad?w=400&h=400&fit=crop',
        variant_id: null,
      },
    ],
  },
  {
    product_id: 'frame-016-58cc-4372-a567-0e02b2c3d479',
    name: 'Kính Nhựa TR90 Dẻo LILY 7065',
    base_price: 390000,
    category_type: 'FRAME',
    is_active: true,
    bridge_width_mm: 16,
    lens_width_mm: 50,
    total_width_mm: 135,
    material: 'PLASTIC',
    shape: 'RECTANGLE',
    variants: [
      {
        variant_id: 'v-frm-016-001',
        color_name: 'Blue',
        sale_price: 390000,
        sku: 'FRM-7065-BLU',
        is_preorder: false,
        expected_availability: null,
      },
    ],
    images: [
      {
        image_id: 'img-frm-016',
        image_url: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=400&h=400&fit=crop',
        variant_id: null,
      },
    ],
  },
];

// Frame shapes matching product_frames.shape
const FRAME_SHAPES = [
  { id: 'CAT_EYE', label: 'Mắt mèo' },
  { id: 'ROUND', label: 'Tròn' },
  { id: 'OVAL', label: 'Oval' },
  { id: 'RECTANGLE', label: 'Vuông/Chữ nhật' },
  { id: 'POLYGON', label: 'Đa giác' },
];

// Frame materials matching product_frames.material
const FRAME_MATERIALS = [
  { id: 'PLASTIC', label: 'Nhựa cứng' },
  { id: 'METAL', label: 'Kim loại' },
  { id: 'PLASTIC_METAL', label: 'Nhựa pha kim loại' },
  { id: 'TITANIUM', label: 'Titan' },
];

// Frame width categories based on total_width_mm
const FRAME_WIDTHS = [
  { id: 'NARROW', label: 'Hẹp', range: { min: 0, max: 135 } },
  { id: 'MEDIUM', label: 'Vừa', range: { min: 136, max: 142 } },
  { id: 'WIDE', label: 'Rộng', range: { min: 143, max: 999 } },
];

/**
 * Helper function to transform product for display
 */
const transformProductForDisplay = (product) => ({
  id: product.product_id,
  product_id: product.product_id,
  name: product.name,
  price: product.variants[0]?.sale_price || product.base_price,
  base_price: product.base_price,
  image: product.images[0]?.image_url || '',
  images: product.images,
  shape: product.shape,
  material: product.material,
  bridge_width_mm: product.bridge_width_mm,
  lens_width_mm: product.lens_width_mm,
  total_width_mm: product.total_width_mm,
  variants: product.variants,
  badge: product.badge,
  category_type: product.category_type,
  is_active: product.is_active,
});

/**
 * Frames store with Zustand
 */
export const useFramesStore = create(
  devtools(
    (set, get) => ({
      // State
      frames: [],
      frameShapes: FRAME_SHAPES,
      frameMaterials: FRAME_MATERIALS,
      frameWidths: FRAME_WIDTHS,
      isLoading: false,
      error: null,
      pagination: {
        currentPage: 1,
        pageSize: 6,
        totalItems: 0,
        totalPages: 0,
      },
      filters: {
        shapes: [],
        materials: [],
        widths: [],
        priceRange: { min: 0, max: 5000000 },
        searchQuery: '',
      },

      // Actions
      setLoading: (isLoading) => set({ isLoading }),
      setError: (error) => set({ error }),

      setFilters: (newFilters) =>
        set((state) => ({
          filters: { ...state.filters, ...newFilters },
          pagination: { ...state.pagination, currentPage: 1 },
        })),

      toggleShape: (shape) =>
        set((state) => {
          const shapes = state.filters.shapes.includes(shape)
            ? state.filters.shapes.filter((s) => s !== shape)
            : [...state.filters.shapes, shape];
          return {
            filters: { ...state.filters, shapes },
            pagination: { ...state.pagination, currentPage: 1 },
          };
        }),

      toggleMaterial: (material) =>
        set((state) => {
          const materials = state.filters.materials.includes(material)
            ? state.filters.materials.filter((m) => m !== material)
            : [...state.filters.materials, material];
          return {
            filters: { ...state.filters, materials },
            pagination: { ...state.pagination, currentPage: 1 },
          };
        }),

      toggleWidth: (width) =>
        set((state) => {
          const widths = state.filters.widths.includes(width)
            ? state.filters.widths.filter((w) => w !== width)
            : [...state.filters.widths, width];
          return {
            filters: { ...state.filters, widths },
            pagination: { ...state.pagination, currentPage: 1 },
          };
        }),

      setPriceRange: (priceRange) =>
        set((state) => ({
          filters: { ...state.filters, priceRange },
          pagination: { ...state.pagination, currentPage: 1 },
        })),

      clearFilters: () =>
        set((state) => ({
          filters: {
            shapes: [],
            materials: [],
            widths: [],
            priceRange: { min: 0, max: 5000000 },
            searchQuery: '',
          },
          pagination: { ...state.pagination, currentPage: 1 },
        })),

      setCurrentPage: (page) =>
        set((state) => ({
          pagination: { ...state.pagination, currentPage: page },
        })),

      setPageSize: (pageSize) =>
        set((state) => ({
          pagination: { ...state.pagination, pageSize, currentPage: 1 },
        })),

      // Async action to fetch frames (simulates API call)
      fetchFrames: async () => {
        const { filters, pagination, frameWidths } = get();

        set({ isLoading: true, error: null });

        try {
          // Simulate API delay
          await new Promise((resolve) => setTimeout(resolve, 500));

          // Filter products based on current filters
          let filteredFrames = [...MOCK_FRAMES].filter((p) => p.is_active);

          // Filter by shape
          if (filters.shapes.length > 0) {
            filteredFrames = filteredFrames.filter((frame) =>
              filters.shapes.includes(frame.shape)
            );
          }

          // Filter by material
          if (filters.materials.length > 0) {
            filteredFrames = filteredFrames.filter((frame) =>
              filters.materials.includes(frame.material)
            );
          }

          // Filter by width category
          if (filters.widths.length > 0) {
            filteredFrames = filteredFrames.filter((frame) => {
              return filters.widths.some((widthId) => {
                const widthCat = frameWidths.find((w) => w.id === widthId);
                if (!widthCat) return false;
                return (
                  frame.total_width_mm >= widthCat.range.min &&
                  frame.total_width_mm <= widthCat.range.max
                );
              });
            });
          }

          // Filter by price range (using first variant's sale_price)
          filteredFrames = filteredFrames.filter((frame) => {
            const price = frame.variants[0]?.sale_price || frame.base_price;
            return price >= filters.priceRange.min && price <= filters.priceRange.max;
          });

          // Filter by search query
          if (filters.searchQuery) {
            const query = filters.searchQuery.toLowerCase();
            filteredFrames = filteredFrames.filter((frame) =>
              frame.name.toLowerCase().includes(query)
            );
          }

          // Calculate pagination
          const totalItems = filteredFrames.length;
          const totalPages = Math.ceil(totalItems / pagination.pageSize);
          const startIndex = (pagination.currentPage - 1) * pagination.pageSize;
          const endIndex = startIndex + pagination.pageSize;
          const paginatedFrames = filteredFrames
            .slice(startIndex, endIndex)
            .map(transformProductForDisplay);

          set({
            frames: paginatedFrames,
            pagination: {
              ...pagination,
              totalItems,
              totalPages,
            },
            isLoading: false,
          });

          return { frames: paginatedFrames, totalItems, totalPages };
        } catch (error) {
          set({
            error: 'Không thể tải danh sách gọng kính. Vui lòng thử lại.',
            isLoading: false,
          });
          throw error;
        }
      },

      // Get single frame by product_id
      getFrameById: async (productId) => {
        set({ isLoading: true, error: null });

        try {
          await new Promise((resolve) => setTimeout(resolve, 300));
          const frame = MOCK_FRAMES.find((f) => f.product_id === productId);

          set({ isLoading: false });

          if (!frame) {
            throw new Error('Không tìm thấy sản phẩm');
          }

          return transformProductForDisplay(frame);
        } catch (error) {
          set({
            error: error.message || 'Không thể tải thông tin sản phẩm.',
            isLoading: false,
          });
          throw error;
        }
      },
    }),
    { name: 'frames-store' }
  )
);

export default useFramesStore;
