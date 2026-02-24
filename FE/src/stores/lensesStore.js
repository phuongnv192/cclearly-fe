/**
 * Lenses Store
 * Manages lenses state with Zustand
 * Structure matches database schema:
 * - products (product_id, name, base_price, category_type, is_active)
 * - product_lenses (product_id, lens_type, refractive_index)
 * - product_lens_tech_map (product_id, tech_id)
 * - master_lens_technologies (tech_id, name)
 * - product_variants (variant_id, color_name, sale_price, sku, is_preorder, expected_availability, product_id)
 * - product_images (image_id, image_url, product_id, variant_id)
 */

import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

// Mock data matching database structure
const MOCK_LENSES = [
  {
    product_id: 'f47ac10b-58cc-4372-a567-0e02b2c3d479',
    name: 'Tròng Kính Chống Ánh Sáng Xanh 1.56',
    base_price: 450000,
    category_type: 'LENS',
    is_active: true,
    lens_type: 'SINGLE_VISION',
    refractive_index: 1.56,
    technologies: [
      { tech_id: 'a1b2c3d4-1111-2222-3333-444455556666', name: 'Blue Light Filter' },
    ],
    variants: [
      {
        variant_id: 'v1-001',
        color_name: 'Clear',
        sale_price: 450000,
        sku: 'LENS-BL-156-CLR',
        is_preorder: false,
        expected_availability: null,
      },
    ],
    images: [
      {
        image_id: 'img-001',
        image_url: 'https://images.unsplash.com/photo-1574258495973-f010dfbb5371?w=400&h=400&fit=crop',
        variant_id: null,
      },
    ],
  },
  {
    product_id: 'f47ac10b-58cc-4372-a567-0e02b2c3d480',
    name: 'Tròng Kính Đổi Màu Photochromic 1.60',
    base_price: 850000,
    category_type: 'LENS',
    is_active: true,
    lens_type: 'SINGLE_VISION',
    refractive_index: 1.6,
    technologies: [
      { tech_id: 'a1b2c3d4-2222-3333-4444-555566667777', name: 'Photochromic' },
      { tech_id: 'a1b2c3d4-3333-4444-5555-666677778888', name: 'UV Protection' },
    ],
    variants: [
      {
        variant_id: 'v2-001',
        color_name: 'Gray Transition',
        sale_price: 850000,
        sku: 'LENS-PC-160-GRY',
        is_preorder: false,
        expected_availability: null,
      },
      {
        variant_id: 'v2-002',
        color_name: 'Brown Transition',
        sale_price: 850000,
        sku: 'LENS-PC-160-BRN',
        is_preorder: false,
        expected_availability: null,
      },
    ],
    images: [
      {
        image_id: 'img-002',
        image_url: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=400&h=400&fit=crop',
        variant_id: null,
      },
    ],
    badge: 'Bán chạy',
  },
  {
    product_id: 'f47ac10b-58cc-4372-a567-0e02b2c3d481',
    name: 'Tròng Kính Lũy Tiến Premium 1.67',
    base_price: 2500000,
    category_type: 'LENS',
    is_active: true,
    lens_type: 'PROGRESSIVE',
    refractive_index: 1.67,
    technologies: [
      { tech_id: 'a1b2c3d4-3333-4444-5555-666677778888', name: 'UV Protection' },
      { tech_id: 'a1b2c3d4-4444-5555-6666-777788889999', name: 'Anti-Scratch' },
    ],
    variants: [
      {
        variant_id: 'v3-001',
        color_name: 'Clear',
        sale_price: 2500000,
        sku: 'LENS-PRG-167-CLR',
        is_preorder: false,
        expected_availability: null,
      },
    ],
    images: [
      {
        image_id: 'img-003',
        image_url: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=400&h=400&fit=crop',
        variant_id: null,
      },
    ],
    badge: 'Premium',
  },
  {
    product_id: 'f47ac10b-58cc-4372-a567-0e02b2c3d482',
    name: 'Tròng Kính Siêu Mỏng 1.74',
    base_price: 1800000,
    category_type: 'LENS',
    is_active: true,
    lens_type: 'SINGLE_VISION',
    refractive_index: 1.74,
    technologies: [
      { tech_id: 'a1b2c3d4-1111-2222-3333-444455556666', name: 'Blue Light Filter' },
      { tech_id: 'a1b2c3d4-4444-5555-6666-777788889999', name: 'Anti-Scratch' },
    ],
    variants: [
      {
        variant_id: 'v4-001',
        color_name: 'Clear',
        sale_price: 1800000,
        sku: 'LENS-SV-174-CLR',
        is_preorder: false,
        expected_availability: null,
      },
    ],
    images: [
      {
        image_id: 'img-004',
        image_url: 'https://images.unsplash.com/photo-1574258495973-f010dfbb5371?w=400&h=400&fit=crop',
        variant_id: null,
      },
    ],
  },
  {
    product_id: 'f47ac10b-58cc-4372-a567-0e02b2c3d483',
    name: 'Tròng Kính Chống UV 1.56',
    base_price: 350000,
    category_type: 'LENS',
    is_active: true,
    lens_type: 'SINGLE_VISION',
    refractive_index: 1.56,
    technologies: [
      { tech_id: 'a1b2c3d4-3333-4444-5555-666677778888', name: 'UV Protection' },
    ],
    variants: [
      {
        variant_id: 'v5-001',
        color_name: 'Clear',
        sale_price: 350000,
        sku: 'LENS-UV-156-CLR',
        is_preorder: false,
        expected_availability: null,
      },
    ],
    images: [
      {
        image_id: 'img-005',
        image_url: 'https://images.unsplash.com/photo-1585386959984-a4155224a1ad?w=400&h=400&fit=crop',
        variant_id: null,
      },
    ],
  },
  {
    product_id: 'f47ac10b-58cc-4372-a567-0e02b2c3d484',
    name: 'Tròng Kính Đa Tròng Office 1.60',
    base_price: 1200000,
    category_type: 'LENS',
    is_active: true,
    lens_type: 'BIFOCAL',
    refractive_index: 1.6,
    technologies: [
      { tech_id: 'a1b2c3d4-1111-2222-3333-444455556666', name: 'Blue Light Filter' },
    ],
    variants: [
      {
        variant_id: 'v6-001',
        color_name: 'Clear',
        sale_price: 1200000,
        sku: 'LENS-BF-160-CLR',
        is_preorder: false,
        expected_availability: null,
      },
    ],
    images: [
      {
        image_id: 'img-006',
        image_url: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&h=400&fit=crop',
        variant_id: null,
      },
    ],
    badge: 'New',
  },
  {
    product_id: 'f47ac10b-58cc-4372-a567-0e02b2c3d485',
    name: 'Tròng Kính Polycarbonate Chống Vỡ',
    base_price: 650000,
    category_type: 'LENS',
    is_active: true,
    lens_type: 'SINGLE_VISION',
    refractive_index: 1.59,
    technologies: [
      { tech_id: 'a1b2c3d4-3333-4444-5555-666677778888', name: 'UV Protection' },
      { tech_id: 'a1b2c3d4-5555-6666-7777-888899990000', name: 'Impact Resistant' },
    ],
    variants: [
      {
        variant_id: 'v7-001',
        color_name: 'Clear',
        sale_price: 650000,
        sku: 'LENS-PC-159-CLR',
        is_preorder: false,
        expected_availability: null,
      },
    ],
    images: [
      {
        image_id: 'img-007',
        image_url: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=400&fit=crop',
        variant_id: null,
      },
    ],
  },
  {
    product_id: 'f47ac10b-58cc-4372-a567-0e02b2c3d486',
    name: 'Tròng Kính Thủy Tinh Cao Cấp 1.60',
    base_price: 550000,
    category_type: 'LENS',
    is_active: true,
    lens_type: 'SINGLE_VISION',
    refractive_index: 1.6,
    technologies: [
      { tech_id: 'a1b2c3d4-3333-4444-5555-666677778888', name: 'UV Protection' },
    ],
    variants: [
      {
        variant_id: 'v8-001',
        color_name: 'Clear',
        sale_price: 550000,
        sku: 'LENS-GL-160-CLR',
        is_preorder: false,
        expected_availability: null,
      },
    ],
    images: [
      {
        image_id: 'img-008',
        image_url: 'https://images.unsplash.com/photo-1473188588951-666fce8e7c68?w=400&h=400&fit=crop',
        variant_id: null,
      },
    ],
  },
  {
    product_id: 'f47ac10b-58cc-4372-a567-0e02b2c3d487',
    name: 'Tròng Kính Đổi Màu + Chống Ánh Sáng Xanh 1.67',
    base_price: 1500000,
    category_type: 'LENS',
    is_active: true,
    lens_type: 'SINGLE_VISION',
    refractive_index: 1.67,
    technologies: [
      { tech_id: 'a1b2c3d4-2222-3333-4444-555566667777', name: 'Photochromic' },
      { tech_id: 'a1b2c3d4-1111-2222-3333-444455556666', name: 'Blue Light Filter' },
    ],
    variants: [
      {
        variant_id: 'v9-001',
        color_name: 'Gray Transition',
        sale_price: 1500000,
        sku: 'LENS-PCBL-167-GRY',
        is_preorder: false,
        expected_availability: null,
      },
    ],
    images: [
      {
        image_id: 'img-009',
        image_url: 'https://images.unsplash.com/photo-1574258495973-f010dfbb5371?w=400&h=400&fit=crop',
        variant_id: null,
      },
    ],
    badge: 'Hot',
  },
  {
    product_id: 'f47ac10b-58cc-4372-a567-0e02b2c3d488',
    name: 'Tròng Kính Lũy Tiến Digital 1.60',
    base_price: 1800000,
    category_type: 'LENS',
    is_active: true,
    lens_type: 'PROGRESSIVE',
    refractive_index: 1.6,
    technologies: [
      { tech_id: 'a1b2c3d4-1111-2222-3333-444455556666', name: 'Blue Light Filter' },
    ],
    variants: [
      {
        variant_id: 'v10-001',
        color_name: 'Clear',
        sale_price: 1800000,
        sku: 'LENS-PRG-160-CLR',
        is_preorder: false,
        expected_availability: null,
      },
    ],
    images: [
      {
        image_id: 'img-010',
        image_url: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=400&h=400&fit=crop',
        variant_id: null,
      },
    ],
  },
  {
    product_id: 'f47ac10b-58cc-4372-a567-0e02b2c3d489',
    name: 'Tròng Kính Đa Tròng Cổ Điển 1.56',
    base_price: 750000,
    category_type: 'LENS',
    is_active: true,
    lens_type: 'BIFOCAL',
    refractive_index: 1.56,
    technologies: [
      { tech_id: 'a1b2c3d4-3333-4444-5555-666677778888', name: 'UV Protection' },
    ],
    variants: [
      {
        variant_id: 'v11-001',
        color_name: 'Clear',
        sale_price: 750000,
        sku: 'LENS-BF-156-CLR',
        is_preorder: false,
        expected_availability: null,
      },
    ],
    images: [
      {
        image_id: 'img-011',
        image_url: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=400&h=400&fit=crop',
        variant_id: null,
      },
    ],
  },
  {
    product_id: 'f47ac10b-58cc-4372-a567-0e02b2c3d490',
    name: 'Tròng Kính Siêu Nhẹ MR-8 1.60',
    base_price: 950000,
    category_type: 'LENS',
    is_active: true,
    lens_type: 'SINGLE_VISION',
    refractive_index: 1.6,
    technologies: [
      { tech_id: 'a1b2c3d4-1111-2222-3333-444455556666', name: 'Blue Light Filter' },
      { tech_id: 'a1b2c3d4-6666-7777-8888-999900001111', name: 'Ultra Light' },
    ],
    variants: [
      {
        variant_id: 'v12-001',
        color_name: 'Clear',
        sale_price: 950000,
        sku: 'LENS-MR8-160-CLR',
        is_preorder: false,
        expected_availability: null,
      },
    ],
    images: [
      {
        image_id: 'img-012',
        image_url: 'https://images.unsplash.com/photo-1574258495973-f010dfbb5371?w=400&h=400&fit=crop',
        variant_id: null,
      },
    ],
    badge: 'New',
  },
  {
    product_id: 'f47ac10b-58cc-4372-a567-0e02b2c3d491',
    name: 'Tròng Kính Lũy Tiến Golf 1.67',
    base_price: 3200000,
    category_type: 'LENS',
    is_active: true,
    lens_type: 'PROGRESSIVE',
    refractive_index: 1.67,
    technologies: [
      { tech_id: 'a1b2c3d4-2222-3333-4444-555566667777', name: 'Photochromic' },
      { tech_id: 'a1b2c3d4-3333-4444-5555-666677778888', name: 'UV Protection' },
    ],
    variants: [
      {
        variant_id: 'v13-001',
        color_name: 'Clear',
        sale_price: 3200000,
        sku: 'LENS-PRG-167-GOLF',
        is_preorder: false,
        expected_availability: null,
      },
    ],
    images: [
      {
        image_id: 'img-013',
        image_url: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=400&h=400&fit=crop',
        variant_id: null,
      },
    ],
    badge: 'Premium',
  },
  {
    product_id: 'f47ac10b-58cc-4372-a567-0e02b2c3d492',
    name: 'Tròng Kính Chống Mỏi Mắt 1.56',
    base_price: 480000,
    category_type: 'LENS',
    is_active: true,
    lens_type: 'SINGLE_VISION',
    refractive_index: 1.56,
    technologies: [
      { tech_id: 'a1b2c3d4-1111-2222-3333-444455556666', name: 'Blue Light Filter' },
      { tech_id: 'a1b2c3d4-7777-8888-9999-000011112222', name: 'Anti-Fatigue' },
    ],
    variants: [
      {
        variant_id: 'v14-001',
        color_name: 'Clear',
        sale_price: 480000,
        sku: 'LENS-AF-156-CLR',
        is_preorder: false,
        expected_availability: null,
      },
    ],
    images: [
      {
        image_id: 'img-014',
        image_url: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=400&h=400&fit=crop',
        variant_id: null,
      },
    ],
  },
  {
    product_id: 'f47ac10b-58cc-4372-a567-0e02b2c3d493',
    name: 'Tròng Kính Đổi Màu Xám 1.60',
    base_price: 780000,
    category_type: 'LENS',
    is_active: true,
    lens_type: 'SINGLE_VISION',
    refractive_index: 1.6,
    technologies: [
      { tech_id: 'a1b2c3d4-2222-3333-4444-555566667777', name: 'Photochromic' },
    ],
    variants: [
      {
        variant_id: 'v15-001',
        color_name: 'Gray Transition',
        sale_price: 780000,
        sku: 'LENS-PC-160-GRY2',
        is_preorder: false,
        expected_availability: null,
      },
    ],
    images: [
      {
        image_id: 'img-015',
        image_url: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&h=400&fit=crop',
        variant_id: null,
      },
    ],
  },
  {
    product_id: 'f47ac10b-58cc-4372-a567-0e02b2c3d494',
    name: 'Tròng Kính Lũy Tiến Drive Safe 1.74',
    base_price: 4500000,
    category_type: 'LENS',
    is_active: true,
    lens_type: 'PROGRESSIVE',
    refractive_index: 1.74,
    technologies: [
      { tech_id: 'a1b2c3d4-3333-4444-5555-666677778888', name: 'UV Protection' },
      { tech_id: 'a1b2c3d4-8888-9999-0000-111122223333', name: 'Night Vision' },
    ],
    variants: [
      {
        variant_id: 'v16-001',
        color_name: 'Clear',
        sale_price: 4500000,
        sku: 'LENS-PRG-174-DRV',
        is_preorder: false,
        expected_availability: null,
      },
    ],
    images: [
      {
        image_id: 'img-016',
        image_url: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=400&h=400&fit=crop',
        variant_id: null,
      },
    ],
    badge: 'Premium',
  },
];

// Lens types matching product_lenses.lens_type
const LENS_TYPES = [
  { id: 'SINGLE_VISION', label: 'Đơn tròng' },
  { id: 'BIFOCAL', label: 'Đa tròng' },
  { id: 'PROGRESSIVE', label: 'Lũy tiến' },
];

// Technologies from master_lens_technologies
const TECHNOLOGIES = [
  { tech_id: 'a1b2c3d4-1111-2222-3333-444455556666', name: 'Blue Light Filter', label: 'Chống ánh sáng xanh' },
  { tech_id: 'a1b2c3d4-2222-3333-4444-555566667777', name: 'Photochromic', label: 'Đổi màu' },
  { tech_id: 'a1b2c3d4-3333-4444-5555-666677778888', name: 'UV Protection', label: 'Chống UV' },
  { tech_id: 'a1b2c3d4-4444-5555-6666-777788889999', name: 'Anti-Scratch', label: 'Chống xước' },
  { tech_id: 'a1b2c3d4-5555-6666-7777-888899990000', name: 'Impact Resistant', label: 'Chống vỡ' },
  { tech_id: 'a1b2c3d4-6666-7777-8888-999900001111', name: 'Ultra Light', label: 'Siêu nhẹ' },
  { tech_id: 'a1b2c3d4-7777-8888-9999-000011112222', name: 'Anti-Fatigue', label: 'Chống mỏi' },
  { tech_id: 'a1b2c3d4-8888-9999-0000-111122223333', name: 'Night Vision', label: 'Nhìn đêm' },
];

// Refractive indexes matching product_lenses.refractive_index
const REFRACTIVE_INDEXES = [
  { id: 1.56, label: '1.56' },
  { id: 1.59, label: '1.59' },
  { id: 1.6, label: '1.60' },
  { id: 1.67, label: '1.67' },
  { id: 1.74, label: '1.74' },
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
  lens_type: product.lens_type,
  refractive_index: product.refractive_index,
  technologies: product.technologies,
  variants: product.variants,
  badge: product.badge,
  category_type: product.category_type,
  is_active: product.is_active,
});

/**
 * Lenses store with Zustand
 */
export const useLensesStore = create(
  devtools(
    (set, get) => ({
      // State
      lenses: [],
      lensTypes: LENS_TYPES,
      technologies: TECHNOLOGIES,
      refractiveIndexes: REFRACTIVE_INDEXES,
      isLoading: false,
      error: null,
      pagination: {
        currentPage: 1,
        pageSize: 6,
        totalItems: 0,
        totalPages: 0,
      },
      filters: {
        lensTypes: [],
        technologies: [],
        refractiveIndexes: [],
        priceRange: { min: 0, max: 5000000 },
        searchQuery: '',
      },

      // Actions
      setLoading: (isLoading) => set({ isLoading }),

      setFilters: (newFilters) =>
        set((state) => ({
          filters: { ...state.filters, ...newFilters },
          pagination: { ...state.pagination, currentPage: 1 },
        })),

      toggleLensType: (lensType) =>
        set((state) => {
          const lensTypes = state.filters.lensTypes.includes(lensType)
            ? state.filters.lensTypes.filter((id) => id !== lensType)
            : [...state.filters.lensTypes, lensType];
          return {
            filters: { ...state.filters, lensTypes },
            pagination: { ...state.pagination, currentPage: 1 },
          };
        }),

      toggleTechnology: (techId) =>
        set((state) => {
          const technologies = state.filters.technologies.includes(techId)
            ? state.filters.technologies.filter((id) => id !== techId)
            : [...state.filters.technologies, techId];
          return {
            filters: { ...state.filters, technologies },
            pagination: { ...state.pagination, currentPage: 1 },
          };
        }),

      toggleRefractiveIndex: (index) =>
        set((state) => {
          const refractiveIndexes = state.filters.refractiveIndexes.includes(index)
            ? state.filters.refractiveIndexes.filter((i) => i !== index)
            : [...state.filters.refractiveIndexes, index];
          return {
            filters: { ...state.filters, refractiveIndexes },
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
            lensTypes: [],
            technologies: [],
            refractiveIndexes: [],
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

      // Async action to fetch lenses (simulates API call)
      fetchLenses: async () => {
        const { filters, pagination } = get();

        set({ isLoading: true, error: null });

        try {
          // Simulate API delay
          await new Promise((resolve) => setTimeout(resolve, 500));

          // Filter products based on current filters
          let filteredLenses = [...MOCK_LENSES].filter((p) => p.is_active);

          // Filter by lens_type
          if (filters.lensTypes.length > 0) {
            filteredLenses = filteredLenses.filter((lens) =>
              filters.lensTypes.includes(lens.lens_type)
            );
          }

          // Filter by technologies (through product_lens_tech_map)
          if (filters.technologies.length > 0) {
            filteredLenses = filteredLenses.filter((lens) =>
              lens.technologies.some((tech) =>
                filters.technologies.includes(tech.tech_id)
              )
            );
          }

          // Filter by refractive_index
          if (filters.refractiveIndexes.length > 0) {
            filteredLenses = filteredLenses.filter((lens) =>
              filters.refractiveIndexes.includes(lens.refractive_index)
            );
          }

          // Filter by price range (using first variant's sale_price)
          filteredLenses = filteredLenses.filter((lens) => {
            const price = lens.variants[0]?.sale_price || lens.base_price;
            return price >= filters.priceRange.min && price <= filters.priceRange.max;
          });

          // Filter by search query
          if (filters.searchQuery) {
            const query = filters.searchQuery.toLowerCase();
            filteredLenses = filteredLenses.filter(
              (lens) =>
                lens.name.toLowerCase().includes(query) ||
                lens.technologies.some((tech) =>
                  tech.name.toLowerCase().includes(query)
                )
            );
          }

          // Calculate pagination
          const totalItems = filteredLenses.length;
          const totalPages = Math.ceil(totalItems / pagination.pageSize);
          const startIndex = (pagination.currentPage - 1) * pagination.pageSize;
          const endIndex = startIndex + pagination.pageSize;
          const paginatedLenses = filteredLenses
            .slice(startIndex, endIndex)
            .map(transformProductForDisplay);

          set({
            lenses: paginatedLenses,
            pagination: {
              ...pagination,
              totalItems,
              totalPages,
            },
            isLoading: false,
          });

          return { lenses: paginatedLenses, totalItems, totalPages };
        } catch (error) {
          set({
            error: 'Không thể tải danh sách tròng kính. Vui lòng thử lại.',
            isLoading: false,
          });
          throw error;
        }
      },

      // Get single lens by product_id
      getLensById: async (productId) => {
        set({ isLoading: true, error: null });

        try {
          await new Promise((resolve) => setTimeout(resolve, 300));
          const lens = MOCK_LENSES.find((l) => l.product_id === productId);

          set({ isLoading: false });

          if (!lens) {
            throw new Error('Không tìm thấy sản phẩm');
          }

          return transformProductForDisplay(lens);
        } catch (error) {
          set({
            error: error.message || 'Không thể tải thông tin sản phẩm.',
            isLoading: false,
          });
          throw error;
        }
      },
    }),
    { name: 'lenses-store' }
  )
);

export default useLensesStore;
