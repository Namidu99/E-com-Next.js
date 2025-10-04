<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class ProductController extends Controller
{
    public function index(Request $request)
    {
        $query = Product::query();

        $filters = $request->only(['brand', 'search', 'min_price', 'max_price', 'rating', 'active']);
        $query->filter($filters);

        $perPage = $request->get('per_page', 15);
        $products = $query->orderBy('created_at', 'desc')->paginate($perPage);

        return response()->json($products);
    }

    public function show($id)
    {
        $product = Product::findOrFail($id);
        return response()->json($product);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'brand' => 'required|string|max:255',
            'name' => 'required|string|max:255',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
            'quantity' => 'required|integer|min:0',
            'cost_price' => 'required|numeric|min:0',
            'sell_price' => 'required|numeric|min:0',
            'description' => 'nullable|string',
            'rating' => 'nullable|integer|min:1|max:5',
            'active' => 'boolean'
        ]);

        if ($request->hasFile('image')) {
            $imagePath = $request->file('image')->store('products', 'public');
            $validated['image'] = $imagePath;
        }

        $product = Product::create($validated);

        return response()->json([
            'message' => 'Product created successfully',
            'product' => $product
        ], 201);
    }

    public function update(Request $request, $id)
    {
        $product = Product::findOrFail($id);

        $validated = $request->validate([
            'brand' => 'sometimes|required|string|max:255',
            'name' => 'sometimes|required|string|max:255',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
            'quantity' => 'sometimes|required|integer|min:0',
            'cost_price' => 'sometimes|required|numeric|min:0',
            'sell_price' => 'sometimes|required|numeric|min:0',
            'description' => 'nullable|string',
            'rating' => 'nullable|integer|min:1|max:5',
            'active' => 'boolean'
        ]);

        if ($request->hasFile('image')) {
            if ($product->image) {
                Storage::disk('public')->delete($product->image);
            }
            $imagePath = $request->file('image')->store('products', 'public');
            $validated['image'] = $imagePath;
        }

        $product->update($validated);

        return response()->json([
            'message' => 'Product updated successfully',
            'product' => $product
        ]);
    }

    public function destroy($id)
    {
        $product = Product::findOrFail($id);

        if ($product->image) {
            Storage::disk('public')->delete($product->image);
        }

        $product->delete();

        return response()->json([
            'message' => 'Product deleted successfully'
        ]);
    }

    public function activate($id)
    {
        $product = Product::findOrFail($id);
        $product->update(['active' => true]);

        return response()->json([
            'message' => 'Product activated successfully',
            'product' => $product
        ]);
    }

    public function deactivate($id)
    {
        $product = Product::findOrFail($id);
        $product->update(['active' => false]);

        return response()->json([
            'message' => 'Product deactivated successfully',
            'product' => $product
        ]);
    }

    public function search(Request $request)
    {
        $searchTerm = $request->get('q', '');
        
        $products = Product::active()
            ->where(function($query) use ($searchTerm) {
                $query->where('name', 'like', '%' . $searchTerm . '%')
                      ->orWhere('brand', 'like', '%' . $searchTerm . '%')
                      ->orWhere('description', 'like', '%' . $searchTerm . '%');
            })
            ->get();

        return response()->json($products);
    }
}