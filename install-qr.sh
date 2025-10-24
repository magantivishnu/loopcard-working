#!/bin/bash

echo "📦 Installing QR Code dependencies..."

# Install qrcode.react for QR code generation
npm install qrcode.react

# Install types for TypeScript support
npm install --save-dev @types/qrcode.react

echo "✅ QR Code dependencies installed successfully!"
echo ""
echo "Next steps:"
echo "1. Run this script in your project directory"
echo "2. I'll create the QR code components for you"
