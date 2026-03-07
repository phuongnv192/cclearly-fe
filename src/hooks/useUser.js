import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import { userRequest } from '@/api/user';
import { handleErrorApi } from '@/lib/errors/handleError';
import { QUERY_KEYS } from '@/utils/endpoints';

// Get user profile
export const useUserProfile = () => {
  return useQuery({
    queryKey: QUERY_KEYS.PROFILE,
    queryFn: () => userRequest.getProfile(),
    staleTime: 5 * 60 * 1000,
  });
};

// Update user profile
export const useUpdateProfile = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data) => userRequest.updateProfile(data),
    onSuccess: () => {
      toast.success('Cập nhật thông tin thành công!');
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.PROFILE });
    },
    onError: (error) => handleErrorApi({ error }),
  });
};
