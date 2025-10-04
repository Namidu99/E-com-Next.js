<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\Customer;
use Illuminate\Support\Facades\Hash;

class LoginController extends Controller
{
    public function register(Request $request)
    {
        $validated = $request->validate([
            'fname' => 'required',
            'lname' => 'required',
            'email' => 'required|email|unique:customers',
            'contact' => 'required',
            'password' => 'required|min:6',
        ]);

        $validated['password'] = Hash::make($validated['password']);
        $customer = Customer::create($validated);

        return response()->json(['message' => 'Registered successfully', 'customer' => $customer]);
    }

    public function login(Request $request)
    {
        $creds = $request->validate([
            'email' => 'required|email',
            'password' => 'required'
        ]);

        if (!Auth::attempt($creds)) {
            return response()->json(['message' => 'Invalid credentials'], 401);
        }

        $user = Auth::user();

        $tokenResult = $user->createToken(
            'api-token',
            ['*'],
            now()->addHours(48) 
        );

        return response()->json([
            'user' => $user,
            'token' => $tokenResult->plainTextToken,
            'expires_at' => $tokenResult->accessToken->expires_at,
        ]);

    }

    public function logout(Request $request)
    {
        try {
            $currentToken = $request->user()?->currentAccessToken();
            if ($currentToken) {
                $currentToken->delete();
            } else {
                Auth::guard('web')->logout();
                if (method_exists($request, 'session')) {
                    $request->session()?->invalidate();
                    $request->session()?->regenerateToken();
                }
            }

            return response()->json(['message' => 'Logged out successfully']);

        } catch (\Throwable $e) {
            return response()->json([
                'message' => 'Logout failed', 
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
