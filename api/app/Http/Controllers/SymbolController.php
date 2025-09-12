<?php

namespace App\Http\Controllers;

use App\Models\Symbol;
use Illuminate\Http\Request;

class SymbolController extends Controller
{
    public function index(Request $request)
    {
        return response()->json(Symbol::all(['id', 'ticker', 'name']));
    }
}
