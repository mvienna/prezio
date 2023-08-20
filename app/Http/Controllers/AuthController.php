<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rule;

class AuthController extends Controller
{
    public function user(Request $request): JsonResponse
    {
        return $this->jsonResponse($request->user()->toArray());
    }

    public function login(Request $request): JsonResponse
    {
        /*
         * validation
         */
        $rules = [
            'email' => 'required|email',
            'password' => 'required'
        ];
        $validator = Validator::make($request->only('email', 'password'), $rules);
        if ($validator->fails()) {
            return $this->errorResponse(trans('errors.auth.missingCredentials'), 422);
        }

        /*
         * authentication
         */
        if (Auth::attempt($request->only('email', 'password'))) {
            $user = Auth::user();

            $token = $user->createToken('authToken')->plainTextToken;

            return $this->jsonResponse([
                'user' => $user,
                'token' => $token
            ]);
        }

        return $this->errorResponse(trans('errors.auth.invalidCredentials'), 422);
    }

    public function register(Request $request): JsonResponse
    {
        /*
         * validation
         */
        $rules = [
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users|max:255',
            'password' => 'required|string|min:6',
        ];
        $validator = Validator::make($request->all(), $rules);
        if ($validator->fails()) {
            return $this->errorResponse(trans('errors.auth.invalidFields'), 422);
        }

        /*
         * create user
         */
        User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
        ]);

        return $this->successResponse();
    }

    public function logout(Request $request): JsonResponse
    {
        /*
         * delete all tokens, essentially logging the user out
         * delete the current token that was used for the request
         */
        $request->user()->tokens()->delete();
        $request->user()->currentAccessToken()->delete();

        return $this->successResponse();
    }

    public function update(Request $request): JsonResponse
    {
        /*
         * auth
         */
        $user = Auth()->user();

        /*
         * check old password
         */
        if ($request->filled('currentPassword') && !Hash::check($request->currentPassword, $user->password)) {
            return $this->errorResponse(trans('errors.auth.invalidPassword'), 422);
        }

        /*
         * validate
         */
        $rules = [];
        if ($request->filled('name')) {
            $rules['name'] = 'required|string|max:255';
        }
        if ($request->filled('email')) {
            $rules['email'] = [
                'required',
                'email',
                Rule::unique('users')->ignore($user->email, 'email'),
                'max:255',
            ];
        }
        if ($request->filled('password')) {
            $rules['password'] = 'required|string|min:6';
        }
        $this->validate($request, $rules);

        /*
         * update & save
         */
        $user->fill($request->except('currentPassword'));
        $user->save();

        return $this->jsonResponse($user->toArray());
    }
}
