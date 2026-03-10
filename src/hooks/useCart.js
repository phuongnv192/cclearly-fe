import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import { cartRequest } from '@/api/cart';
import { handleErrorApi } from '@/lib/errors/handleError';
import { QUERY_KEYS } from '@/utils/endpoints';

// Get cart
export const useCart = (options = {}) => {
  return useQuery({
    queryKey: QUERY_KEYS.CART,
    queryFn: async () => {
      const data = await cartRequest.getCart();
      return data;
    },
    staleTime: 0, // Always fetch fresh
    ...options,
  });
};

// Add to cart
export const useAddToCart = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data) => {
      const res = await cartRequest.addToCart(data);
      return res;
    },
    onSuccess: () => {
      toast.success('Thêm vào giỏ hàng thành công!');
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.CART });
    },
    onError: (error) => {
      handleErrorApi({ error });
    },
  });
};

// Update cart item quantity
export const useUpdateCartItem = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ itemId, quantity }) => {
      const res = await cartRequest.updateCartItem(itemId, quantity);
      return res;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.CART });
    },
    onError: (error) => {
      handleErrorApi({ error });
    },
  });
};

// Remove from cart
export const useRemoveCartItem = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (itemId) => {
      const res = await cartRequest.removeCartItem(itemId);
      return res;
    },
    onSuccess: () => {
      toast.success('Đã xóa khỏi giỏ hàng!');
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.CART });
    },
    onError: (error) => {
      handleErrorApi({ error });
    },
  });
};

// Clear cart
export const useClearCart = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      const res = await cartRequest.clearCart();
      return res;
    },
    onSuccess: () => {
      toast.success('Đã xóa giỏ hàng!');
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.CART });
    },
    onError: (error) => {
      handleErrorApi({ error });
    },
  });
};
