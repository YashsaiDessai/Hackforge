import React, { useState, useEffect } from "react";
import { MarketPrice, WeatherAlert, User } from "@/entities/all";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  TrendingUp, TrendingDown, AlertTriangle, Cloud, Sun, 
  Droplets, Award, Star, MapPin, Calendar
} from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { motion } from "framer-motion";

export default function Dashboard() {
  const [marketPrices, setMarketPrices] = useState([]);
  const [weatherAlerts, setWeatherAlerts] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [prices, alerts, user] = await Promise.all([
        MarketPrice.list('-created_date', 10),
        WeatherAlert.filter({ is_active: true }, '-created_date', 5),
        User.me().catch(() => null)
      ]);
      setMarketPrices(prices);
      setWeatherAlerts(alerts);
      setCurrentUser(user);
    } catch (error) {
      console.error('Error loading data:', error);
    }
    setLoading(false);
  };

  const getBadgeColor = (badge) => {
    const colors = {
      newbie: "bg-blue-100 text-blue-800",
      trusted_farmer: "bg-green-100 text-green-800",
      golden_farmer: "bg-yellow-100 text-yellow-800",
      expert_trader: "bg-purple-100 text-purple-800",
      verified_buyer: "bg-indigo-100 text-indigo-800"
    };
    return colors[badge] || "bg-gray-100 text-gray-800";
  };

  const getAlertColor = (severity) => {
    const colors = {
      low: "border-yellow-200 bg-yellow-50",
      medium: "border-orange-200 bg-orange-50",
      high: "border-red-200 bg-red-50",
      extreme: "border-red-500 bg-red-100"
    };
    return colors[severity] || "border-gray-200 bg-gray-50";
  };

  if (loading) {
    return (
      <div className="p-4 space-y-4">
        {Array(3).fill(0).map((_, i) => (
          <div key={i} className="h-24 bg-gray-200 rounded-xl animate-pulse" />
        ))}
      </div>
    );
  }

  return (
    <div className="p-4 space-y-6">
      {/* Welcome Section */}
      {currentUser && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-green-500 to-green-600 rounded-2xl p-6 text-white shadow-lg"
        >
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold mb-1">नमस्कार, {currentUser.full_name}!</h2>
              <div className="flex items-center gap-2 mb-2">
                <MapPin className="w-4 h-4" />
                <span className="text-green-100">{currentUser.location || "स्थान अपडेट करें"}</span>
              </div>
              <div className="flex items-center gap-2">
                <Star className="w-4 h-4 text-yellow-300" />
                <span>{currentUser.rating}/5</span>
                <Badge className={`ml-2 ${getBadgeColor(currentUser.badge)}`}>
                  {currentUser.badge?.replace('_', ' ')}
                </Badge>
              </div>
            </div>
            <div className="text-right">
              <div className="flex items-center gap-1 mb-1">
                <Award className="w-5 h-5 text-yellow-300" />
                <span className="font-bold">{currentUser.rewards_points || 0}</span>
              </div>
              <p className="text-green-100 text-sm">रिवार्ड पॉइंट्स</p>
            </div>
          </div>
        </motion.div>
      )}

      {/* Weather Alerts */}
      {weatherAlerts.length > 0 && (
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="space-y-3"
        >
          <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-orange-500" />
            मौसम चेतावनी
          </h3>
          {weatherAlerts.map((alert) => (
            <Alert key={alert.id} className={`${getAlertColor(alert.severity)} border-l-4`}>
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                <div className="font-medium mb-1">
                  {alert.alert_type?.replace('_', ' ')} - {alert.location}
                </div>
                <p className="text-sm">{alert.description}</p>
                {alert.advice && (
                  <p className="text-sm mt-2 font-medium">सलाह: {alert.advice}</p>
                )}
              </AlertDescription>
            </Alert>
          ))}
        </motion.div>
      )}

      {/* Market Prices */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg font-bold text-gray-900 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-green-600" />
              आज के बाज़ार भाव
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {marketPrices.length > 0 ? (
              marketPrices.map((price) => (
                <motion.div
                  key={price.id}
                  whileHover={{ scale: 1.02 }}
                  className="flex items-center justify-between p-4 bg-gradient-to-r from-green-50 to-blue-50 rounded-xl border border-green-100"
                >
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900">{price.commodity}</h4>
                    <p className="text-sm text-gray-600 flex items-center gap-1">
                      <MapPin className="w-3 h-3" />
                      {price.market_name}, {price.location}
                    </p>
                    <Badge variant="outline" className="mt-1">
                      ग्रेड {price.quality_grade}
                    </Badge>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center gap-2">
                      <span className="text-xl font-bold text-gray-900">
                        ₹{price.price_per_kg}/किग्रा
                      </span>
                      {price.price_change !== 0 && (
                        <div className={`flex items-center gap-1 ${
                          price.price_change > 0 ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {price.price_change > 0 ? (
                            <TrendingUp className="w-4 h-4" />
                          ) : (
                            <TrendingDown className="w-4 h-4" />
                          )}
                          <span className="text-sm font-medium">
                            ₹{Math.abs(price.price_change)}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))
            ) : (
              <div className="text-center py-8 text-gray-500">
                <Cloud className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                <p>कोई बाज़ार भाव उपलब्ध नहीं</p>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>

      {/* Today's Weather Widget */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold mb-1">आज का मौसम</h3>
                <p className="text-blue-100 flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  {new Date().toLocaleDateString('hi-IN')}
                </p>
              </div>
              <div className="text-right">
                <div className="flex items-center gap-2 mb-2">
                  <Sun className="w-8 h-8 text-yellow-300" />
                  <span className="text-2xl font-bold">28°C</span>
                </div>
                <div className="flex items-center gap-2 text-blue-100">
                  <Droplets className="w-4 h-4" />
                  <span>बारिश की संभावना: 30%</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="grid grid-cols-2 gap-4"
      >
        <Button className="h-16 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 rounded-xl shadow-lg">
          <div className="text-center">
            <TrendingUp className="w-6 h-6 mx-auto mb-1" />
            <span className="text-sm font-medium">मार्केट ट्रेंड्स</span>
          </div>
        </Button>
        <Button className="h-16 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 rounded-xl shadow-lg">
          <div className="text-center">
            <Award className="w-6 h-6 mx-auto mb-1" />
            <span className="text-sm font-medium">AI सलाह</span>
          </div>
        </Button>
      </motion.div>
    </div>
  );
}