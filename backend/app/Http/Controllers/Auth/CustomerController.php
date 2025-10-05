<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\Customer;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\ValidationException;

class CustomerController extends Controller
{
    /**
     * Register a new customer
     */
    public function register(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'fname' => 'required|string|max:255',
            'lname' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:customers',
            'contact' => 'required|string|max:20',
            'password' => 'required|string|min:8|confirmed',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation errors',
                'errors' => $validator->errors()
            ], 422);
        }

        $customer = Customer::create([
            'fname' => $request->fname,
            'lname' => $request->lname,
            'email' => $request->email,
            'contact' => $request->contact,
            'password' => Hash::make($request->password),
            'active' => true,
        ]);

        $token = $customer->createToken('customer-token')->plainTextToken;

        return response()->json([
            'success' => true,
            'message' => 'Customer registered successfully',
            'data' => [
                'customer' => [
                    'id' => $customer->id,
                    'fname' => $customer->fname,
                    'lname' => $customer->lname,
                    'email' => $customer->email,
                    'contact' => $customer->contact,
                    'active' => $customer->active,
                ],
                'token' => $token
            ]
        ], 201);
    }

    /**
     * Login customer
     */
    public function login(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'email' => 'required|email',
            'password' => 'required|string',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation errors',
                'errors' => $validator->errors()
            ], 422);
        }

        $customer = Customer::where('email', $request->email)->first();

        if (!$customer || !Hash::check($request->password, $customer->password)) {
            return response()->json([
                'success' => false,
                'message' => 'Invalid credentials'
            ], 401);
        }

        if (!$customer->isActive()) {
            return response()->json([
                'success' => false,
                'message' => 'Account is deactivated'
            ], 403);
        }

        $token = $customer->createToken('customer-token')->plainTextToken;

        return response()->json([
            'success' => true,
            'message' => 'Login successful',
            'data' => [
                'customer' => [
                    'id' => $customer->id,
                    'fname' => $customer->fname,
                    'lname' => $customer->lname,
                    'email' => $customer->email,
                    'contact' => $customer->contact,
                    'active' => $customer->active,
                ],
                'token' => $token
            ]
        ], 200);
    }

    /**
     * Get customer profile
     */
    public function profile(Request $request)
    {
        $customer = $request->user();

        return response()->json([
            'success' => true,
            'data' => [
                'id' => $customer->id,
                'fname' => $customer->fname,
                'lname' => $customer->lname,
                'email' => $customer->email,
                'contact' => $customer->contact,
                'active' => $customer->active,
            ]
        ], 200);
    }

    /**
     * Update customer profile
     */
    public function updateProfile(Request $request)
    {
        $customer = $request->user();

        $validator = Validator::make($request->all(), [
            'fname' => 'sometimes|required|string|max:255',
            'lname' => 'sometimes|required|string|max:255',
            'email' => 'sometimes|required|string|email|max:255|unique:customers,email,' . $customer->id,
            'contact' => 'sometimes|required|string|max:20',
            'password' => 'sometimes|required|string|min:8|confirmed',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation errors',
                'errors' => $validator->errors()
            ], 422);
        }

        $updateData = $request->only(['fname', 'lname', 'email', 'contact']);

        if ($request->filled('password')) {
            $updateData['password'] = Hash::make($request->password);
        }

        $customer->update($updateData);

        return response()->json([
            'success' => true,
            'message' => 'Profile updated successfully',
            'data' => [
                'id' => $customer->id,
                'fname' => $customer->fname,
                'lname' => $customer->lname,
                'email' => $customer->email,
                'contact' => $customer->contact,
                'active' => $customer->active,
            ]
        ], 200);
    }

    /**
     * Logout customer
     */
    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json([
            'success' => true,
            'message' => 'Logged out successfully'
        ], 200);
    }

    // ========================================
    // ADMIN METHODS
    // ========================================

    /**
     * Get all customers (Admin)
     */
    public function index()
    {
        $customers = Customer::orderBy('created_at', 'desc')->get()->map(function ($customer) {
            return [
                'id' => $customer->id,
                'fname' => $customer->fname,
                'lname' => $customer->lname,
                'email' => $customer->email,
                'contact' => $customer->contact,
                'is_active' => $customer->active,
                'created_at' => $customer->created_at,
                'updated_at' => $customer->updated_at,
            ];
        });

        return response()->json([
            'success' => true,
            'data' => [
                'customers' => $customers
            ]
        ], 200);
    }

    /**
     * Get a specific customer (Admin)
     */
    public function show($id)
    {
        $customer = Customer::find($id);

        if (!$customer) {
            return response()->json([
                'success' => false,
                'message' => 'Customer not found'
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data' => [
                'customer' => [
                    'id' => $customer->id,
                    'fname' => $customer->fname,
                    'lname' => $customer->lname,
                    'email' => $customer->email,
                    'contact' => $customer->contact,
                    'is_active' => $customer->active,
                    'created_at' => $customer->created_at,
                    'updated_at' => $customer->updated_at,
                ]
            ]
        ], 200);
    }

    /**
     * Create a new customer (Admin)
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'fname' => 'required|string|max:255',
            'lname' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:customers',
            'contact' => 'required|string|max:20',
            'password' => 'required|string|min:8',
            'active' => 'sometimes|boolean',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation errors',
                'errors' => $validator->errors()
            ], 422);
        }

        $customer = Customer::create([
            'fname' => $request->fname,
            'lname' => $request->lname,
            'email' => $request->email,
            'contact' => $request->contact,
            'password' => Hash::make($request->password),
            'active' => $request->input('active', true),
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Customer created successfully',
            'data' => [
                'customer' => [
                    'id' => $customer->id,
                    'fname' => $customer->fname,
                    'lname' => $customer->lname,
                    'email' => $customer->email,
                    'contact' => $customer->contact,
                    'is_active' => $customer->active,
                ]
            ]
        ], 201);
    }

    /**
     * Update a customer (Admin)
     */
    public function update(Request $request, $id)
    {
        $customer = Customer::find($id);

        if (!$customer) {
            return response()->json([
                'success' => false,
                'message' => 'Customer not found'
            ], 404);
        }

        $validator = Validator::make($request->all(), [
            'fname' => 'sometimes|required|string|max:255',
            'lname' => 'sometimes|required|string|max:255',
            'email' => 'sometimes|required|string|email|max:255|unique:customers,email,' . $id,
            'contact' => 'sometimes|required|string|max:20',
            'password' => 'sometimes|required|string|min:8',
            'active' => 'sometimes|boolean',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation errors',
                'errors' => $validator->errors()
            ], 422);
        }

        $updateData = $request->only(['fname', 'lname', 'email', 'contact', 'active']);

        if ($request->filled('password')) {
            $updateData['password'] = Hash::make($request->password);
        }

        $customer->update($updateData);

        return response()->json([
            'success' => true,
            'message' => 'Customer updated successfully',
            'data' => [
                'customer' => [
                    'id' => $customer->id,
                    'fname' => $customer->fname,
                    'lname' => $customer->lname,
                    'email' => $customer->email,
                    'contact' => $customer->contact,
                    'is_active' => $customer->active,
                ]
            ]
        ], 200);
    }

    /**
     * Delete a customer (Admin)
     */
    public function destroy($id)
    {
        $customer = Customer::find($id);

        if (!$customer) {
            return response()->json([
                'success' => false,
                'message' => 'Customer not found'
            ], 404);
        }

        $customer->delete();

        return response()->json([
            'success' => true,
            'message' => 'Customer deleted successfully'
        ], 200);
    }

    /**
     * Activate a customer (Admin)
     */
    public function activate($id)
    {
        $customer = Customer::find($id);

        if (!$customer) {
            return response()->json([
                'success' => false,
                'message' => 'Customer not found'
            ], 404);
        }

        $customer->update(['active' => true]);

        return response()->json([
            'success' => true,
            'message' => 'Customer activated successfully',
            'data' => [
                'customer' => [
                    'id' => $customer->id,
                    'fname' => $customer->fname,
                    'lname' => $customer->lname,
                    'is_active' => $customer->active,
                ]
            ]
        ], 200);
    }

    /**
     * Deactivate a customer (Admin)
     */
    public function deactivate($id)
    {
        $customer = Customer::find($id);

        if (!$customer) {
            return response()->json([
                'success' => false,
                'message' => 'Customer not found'
            ], 404);
        }

        $customer->update(['active' => false]);

        return response()->json([
            'success' => true,
            'message' => 'Customer deactivated successfully',
            'data' => [
                'customer' => [
                    'id' => $customer->id,
                    'fname' => $customer->fname,
                    'lname' => $customer->lname,
                    'is_active' => $customer->active,
                ]
            ]
        ], 200);
    }

    /**
     * Get customer statistics (Admin)
     */
    public function stats()
    {
        $total = Customer::count();
        $active = Customer::where('active', true)->count();

        return response()->json([
            'success' => true,
            'total' => $total,
            'active' => $active
        ], 200);
    }
}