import React, { useState, useEffect, useCallback } from "react";
import { BuyerListing } from "@/entities/all";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Search,
  MapPin,
  Phone,
  Star,
  Building2,
  Filter,
  ChevronRight,
  BadgeCheck,
} from "lucide-react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";

export default function Buyers() {
  const [buyers, setBuyers] = useState<any[]>([]);
  const [filteredBuyers, setFilteredBuyers] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedCommodity, setSelectedCommodity] = useState<string>("all");
  const [loading, setLoading] = useState<boolean>(true);

  const commodities = [
    "all",
    "गेहूं",
    "धान",
    "मक्का",
    "चना",
    "मसूर",
    "सरसों",
    "आलू",
    "प्याज",
    "टमाटर",
    "गन्ना",
    "कपास",
    "सोयाबीन",
    "अन्य",
  ];

  const loadBuyers = useCallback(async () => {
    try {
      const buyersData = await BuyerListing.list("-created_date");
      setBuyers(buyersData);
    } catch (error) {
      console.error("Error loading buyers:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  const filterBuyers = useCallback(() => {
    let filtered = buyers;

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      filtered = filtered.filter((buyer: any) =>
        buyer.company_name?.toLowerCase().includes(q) ||
        buyer.location?.toLowerCase().includes(q) ||
        buyer.commodities_buying?.some((c: string) => c.toLowerCase().includes(q))
      );
    }

    if (selectedCommodity !== "all") {
      filtered = filtered.filter((buyer: any) =>
        buyer.commodities_buying?.includes(selectedCommodity)
      );
    }

    setFilteredBuyers(filtered);
  }, [buyers, searchQuery, selectedCommodity]);

  useEffect(() => {
    loadBuyers();
  }, [loadBuyers]);

  useEffect(() => {
    filterBuyers();
  }, [filterBuyers]);

  const handleCallBuyer = (phone: string) => {
    if (!phone) return;
    window.location.href = `tel:${phone}`;
  };

  if (loading) {
    return (
      <div className="p-4 space-y-4">
        {Array(5)
          .fill(0)
          .map((_, i) => (
            <div key={i} className="h-32 bg-gray-200 rounded-xl animate-pulse" />
          ))}
      </div>
    );
  }

  const avgRating =
    filteredBuyers.length > 0
      ? (
          filteredBuyers.reduce(
            (sum: number, b: any) => sum + (typeof b.rating === "number" ? b.rating : 0),
            0
          ) / filteredBuyers.length
        ).toFixed(1)
      : "0";

  return (
    <div className="p-4 space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-6"
      >
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl mb-4">
          <Building2 className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">खरीदार खोजें</h1>
        <p className="text-gray-600">अपनी फसल के लिए बेहतरीन खरीदार ढूंढें</p>
      </motion.div>

      {/* Search and Filter */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="space-y-4"
      >
        <div className="relative">
          <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
          <Input
            placeholder="कंपनी का नाम, स्थान या फसल खोजें..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-12 rounded-xl border-green-200 focus:border-green-400 h-12"
          />
        </div>

        <div className="flex gap-3 overflow-x-auto pb-2">
          <div className="flex items-center gap-2 text-gray-600 min-w-fit">
            <Filter className="w-4 h-4" />
            <span className="text-sm font-medium">फिल्टर:</span>
          </div>
          {commodities.map((commodity) => (
            <Button
              key={commodity}
              variant={selectedCommodity === commodity ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCommodity(commodity)}
              className={`rounded-full min-w-fit ${
                selectedCommodity === commodity
                  ? "bg-green-600 hover:bg-green-700"
                  : "border-green-200 text-green-700 hover:bg-green-50"
              }`}
            >
              {commodity === "all" ? "सभी" : commodity}
            </Button>
          ))}
        </div>
      </motion.div>

      {/* Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="grid grid-cols-3 gap-4"
      >
        <Card className="bg-gradient-to-r from-blue-50 to-blue-100 border-blue-200">
          <CardContent className="p-4 text-center">
            <Building2 className="w-6 h-6 text-blue-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-blue-800">{filteredBuyers.length}</div>
            <p className="text-sm text-blue-600">कुल खरीदार</p>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-r from-green-50 to-green-100 border-green-200">
          <CardContent className="p-4 text-center">
            <BadgeCheck className="w-6 h-6 text-green-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-green-800">
              {filteredBuyers.filter((b: any) => b.is_verified).length}
            </div>
            <p className="text-sm text-green-600">सत्यापित</p>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-r from-orange-50 to-orange-100 border-orange-200">
          <CardContent className="p-4 text-center">
            <Star className="w-6 h-6 text-orange-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-orange-800">{avgRating}</div>
            <p className="text-sm text-orange-600">औसत रेटिंग</p>
          </CardContent>
        </Card>
      </motion.div>

      {/* Buyers List */}
      <div className="space-y-4">
        {filteredBuyers.length === 0 && (
          <div className="text-center py-10 text-gray-500">
            <p>कोई खरीदार नहीं मिला</p>
          </div>
        )}

        {filteredBuyers.map((buyer: any, index: number) => (
          <motion.div
            key={buyer.buyer_id || buyer.id || `${buyer.company_name}-${index}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 + index * 0.05 }}
          >
            <Card className="shadow-lg border-0 bg-white/90 backdrop-blur-sm hover:shadow-xl transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <Avatar className="h-14 w-14 bg-blue-100">
                    <AvatarFallback className="text-blue-700 font-bold text-lg">
                      {buyer.company_name?.[0] || "B"}
                    </AvatarFallback>
                  </Avatar>

                  <div className="flex-1 space-y-3">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-lg font-bold text-gray-900">{buyer.company_name}</h3>
                        {buyer.is_verified && <BadgeCheck className="w-5 h-5 text-green-600" />}
                      </div>
                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        <div className="flex items-center gap-1">
                          <MapPin className="w-4 h-4" />
                          <span>{buyer.location || "-"}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4 text-yellow-500" />
                          <span>{typeof buyer.rating === "number" ? buyer.rating : 0}/5</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {buyer.commodities_buying?.slice(0, 3).map((commodity: string) => (
                        <Badge key={commodity} variant="secondary" className="bg-green-100 text-green-800">
                          {commodity}
                        </Badge>
                      ))}
                      {buyer.commodities_buying?.length > 3 && (
                        <Badge variant="outline">+{buyer.commodities_buying.length - 3} और</Badge>
                      )}
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-gray-500">न्यूनतम मात्रा:</span>
                        <span className="font-medium ml-1">{buyer.min_quantity_tons ?? "-"} टन</span>
                      </div>
                      <div>
                        <span className="text-gray-500">अधिकतम दर:</span>
                        <span className="font-medium ml-1">₹{buyer.max_price_per_kg ?? "-"}/किग्रा</span>
                      </div>
                    </div>

                    {buyer.requirements && (
                      <div className="p-3 bg-gray-50 rounded-lg">
                        <p className="text-sm text-gray-700">
                          <strong>आवश्यकताएं:</strong> {buyer.requirements}
                        </p>
                      </div>
                    )}

                    <div className="flex gap-3">
                      <Button
                        onClick={() => handleCallBuyer(buyer.contact_phone)}
                        className="flex-1 bg-green-600 hover:bg-green-700 rounded-xl"
                      >
                        <Phone className="w-4 h-4 mr-2" />
                        कॉल करें
                      </Button>
                      <Link to={createPageUrl("Chat")} className="flex-1">
                        <Button variant="outline" className="w-full rounded-xl">
                          अधिक जानकारी
                          <ChevronRight className="w-4 h-4 ml-2" />
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
