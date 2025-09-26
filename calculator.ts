import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calculator, MapPin, Clock, Truck, Fuel, Route } from "lucide-react";
import { motion } from "framer-motion";

export default function TransportCalculator() {
  const [formData, setFormData] = useState({
    fromLocation: "",
    toLocation: "",
    distance: "",
    weight: "",
    vehicleType: "",
    fuelPrice: "110"
  });
  const [result, setResult] = useState(null);

  const vehicleTypes = {
    tractor_trolley: { name: "ट्रैक्टर ट्रॉली", rate: 8, capacity: 5, mileage: 8 },
    mini_truck: { name: "छोटा ट्रक", rate: 12, capacity: 3, mileage: 6 },
    truck: { name: "बड़ा ट्रक", rate: 15, capacity: 10, mileage: 4 },
    pickup: { name: "पिकअप", rate: 10, capacity: 1.5, mileage: 10 }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const calculateTransport = () => {
    const { distance, weight, vehicleType, fuelPrice } = formData;
    
    if (!distance || !weight || !vehicleType) {
      alert("कृपया सभी जानकारी भरें");
      return;
    }

    const vehicle = vehicleTypes[vehicleType];
    const distanceNum = parseFloat(distance);
    const weightNum = parseFloat(weight);
    const fuelPriceNum = parseFloat(fuelPrice);

    // Calculate fuel cost
    const fuelCost = (distanceNum * 2 / vehicle.mileage) * fuelPriceNum;
    
    // Calculate base transport cost
    const baseCost = distanceNum * vehicle.rate;
    
    // Add weight factor
    const weightFactor = Math.ceil(weightNum / vehicle.capacity);
    const totalCost = (baseCost + fuelCost) * weightFactor;
    
    // Calculate time (assuming 40 km/h average speed)
    const timeHours = distanceNum / 40;
    
    setResult({
      totalCost: Math.round(totalCost),
      fuelCost: Math.round(fuelCost),
      baseRate: Math.round(baseCost),
      timeHours: timeHours.toFixed(1),
      vehicleInfo: vehicle,
      tripsNeeded: weightFactor
    });
  };

  return (
    <div className="p-4 space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-6"
      >
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl mb-4">
          <Calculator className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">परिवहन कैलकुलेटर</h1>
        <p className="text-gray-600">अपनी फसल की ढुलाई की लागत जानें</p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <Card className="shadow-lg border-0 bg-white/90 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-green-700">
              <Route className="w-5 h-5" />
              यात्रा विवरण
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-green-600" />
                  कहाँ से
                </Label>
                <Input
                  placeholder="शुरुआती स्थान"
                  value={formData.fromLocation}
                  onChange={(e) => handleInputChange('fromLocation', e.target.value)}
                  className="rounded-xl border-green-200 focus:border-green-400"
                />
              </div>
              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-red-600" />
                  कहाँ तक
                </Label>
                <Input
                  placeholder="गंतव्य स्थान"
                  value={formData.toLocation}
                  onChange={(e) => handleInputChange('toLocation', e.target.value)}
                  className="rounded-xl border-green-200 focus:border-green-400"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>दूरी (किलोमीटर)</Label>
              <Input
                type="number"
                placeholder="जैसे: 50"
                value={formData.distance}
                onChange={(e) => handleInputChange('distance', e.target.value)}
                className="rounded-xl border-green-200 focus:border-green-400"
              />
            </div>

            <div className="space-y-2">
              <Label>वजन (टन में)</Label>
              <Input
                type="number"
                step="0.1"
                placeholder="जैसे: 2.5"
                value={formData.weight}
                onChange={(e) => handleInputChange('weight', e.target.value)}
                className="rounded-xl border-green-200 focus:border-green-400"
              />
            </div>

            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <Truck className="w-4 h-4 text-blue-600" />
                वाहन प्रकार
              </Label>
              <Select value={formData.vehicleType} onValueChange={(value) => handleInputChange('vehicleType', value)}>
                <SelectTrigger className="rounded-xl border-green-200">
                  <SelectValue placeholder="वाहन चुनें" />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(vehicleTypes).map(([key, vehicle]) => (
                    <SelectItem key={key} value={key}>
                      <div className="flex items-center gap-2">
                        {vehicle.name}
                        <span className="text-sm text-gray-500">({vehicle.capacity}T तक)</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <Fuel className="w-4 h-4 text-orange-600" />
                डीजल दर (₹/लीटर)
              </Label>
              <Input
                type="number"
                value={formData.fuelPrice}
                onChange={(e) => handleInputChange('fuelPrice', e.target.value)}
                className="rounded-xl border-green-200 focus:border-green-400"
              />
            </div>

            <Button
              onClick={calculateTransport}
              className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 rounded-xl py-6 text-lg font-semibold"
            >
              <Calculator className="w-5 h-5 mr-2" />
              लागत निकालें
            </Button>
          </CardContent>
        </Card>
      </motion.div>

      {result && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="shadow-lg border-0 bg-gradient-to-r from-blue-50 to-green-50">
            <CardHeader>
              <CardTitle className="text-center text-blue-700">परिवहन लागत विवरण</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center mb-6">
                <div className="text-4xl font-bold text-green-600 mb-2">
                  ₹{result.totalCost.toLocaleString()}
                </div>
                <p className="text-gray-600">कुल अनुमानित लागत</p>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-white rounded-xl p-4 text-center shadow-sm">
                  <Clock className="w-6 h-6 text-blue-500 mx-auto mb-2" />
                  <div className="text-xl font-bold text-gray-900">{result.timeHours} घंटे</div>
                  <p className="text-sm text-gray-600">अनुमानित समय</p>
                </div>
                <div className="bg-white rounded-xl p-4 text-center shadow-sm">
                  <Truck className="w-6 h-6 text-green-500 mx-auto mb-2" />
                  <div className="text-xl font-bold text-gray-900">{result.tripsNeeded}</div>
                  <p className="text-sm text-gray-600">ट्रिप्स आवश्यक</p>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between items-center p-3 bg-white rounded-lg">
                  <span className="text-gray-600">बेस रेट</span>
                  <span className="font-semibold">₹{result.baseRate}</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-white rounded-lg">
                  <span className="text-gray-600">ईंधन लागत</span>
                  <span className="font-semibold">₹{result.fuelCost}</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-white rounded-lg">
                  <span className="text-gray-600">वाहन प्रकार</span>
                  <span className="font-semibold">{result.vehicleInfo.name}</span>
                </div>
              </div>

              <div className="mt-6 p-4 bg-yellow-50 rounded-xl border border-yellow-200">
                <p className="text-sm text-yellow-800">
                  <strong>नोट:</strong> यह केवल अनुमानित लागत है। वास्तविक दरें बाज़ार की स्थिति, मौसम और अन्य कारकों पर निर्भर करती हैं।
                </p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </div>
  );
}