<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
    use HasFactory;

    protected $fillable = [
        'brand',
        'name',
        'image',
        'quantity',
        'cost_price',
        'sell_price',
        'description',
        'rating',
        'active'
    ];

    protected $casts = [
        'cost_price' => 'decimal:2',
        'sell_price' => 'decimal:2',
        'rating' => 'integer',
        'active' => 'boolean',
        'quantity' => 'integer'
    ];

    public function scopeActive($query)
    {
        return $query->where('active', true);
    }

    public function scopeFilter($query, array $filters)
    {
        if (!empty($filters['brand'])) {
            $query->where('brand', 'like', '%' . $filters['brand'] . '%');
        }

        if (!empty($filters['search'])) {
            $query->where('name', 'like', '%' . $filters['search'] . '%');
        }

        if (!empty($filters['min_price'])) {
            $query->where('sell_price', '>=', $filters['min_price']);
        }
        if (!empty($filters['max_price'])) {
            $query->where('sell_price', '<=', $filters['max_price']);
        }

        if (!empty($filters['rating'])) {
            $query->where('rating', '>=', $filters['rating']);
        }

        if (isset($filters['active'])) {
            $query->where('active', $filters['active']);
        }

        return $query;
    }
}