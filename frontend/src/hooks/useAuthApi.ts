import { useMutation } from '@tanstack/react-query';
import { useAppDispatch } from '@/store/hooks';
import { loginSuccess } from '@/store/slices/authSlice';
import { post } from '@/utils/api';
import { LoginInput, SignupInput, User } from '@/types';
import { AUTH_TOKEN_KEY, USER_KEY } from '@/utils/constants';

export function useLogin() {
    const dispatch = useAppDispatch();

    return useMutation({
        mutationFn: (data: LoginInput) => post<{ user: User; token: string }>('/auth/signin', data),
        onSuccess: (data) => {
            localStorage.setItem(AUTH_TOKEN_KEY, data.token);
            localStorage.setItem(USER_KEY, JSON.stringify(data.user));
            dispatch(loginSuccess(data));
        },
    });
}

export function useSignup() {
    const dispatch = useAppDispatch();

    return useMutation({
        mutationFn: (data: SignupInput) => post<{ user: User; token: string }>('/auth/signup', data),
        onSuccess: (data) => {
            localStorage.setItem(AUTH_TOKEN_KEY, data.token);
            localStorage.setItem(USER_KEY, JSON.stringify(data.user));
            dispatch(loginSuccess(data));
        },
    });
}
