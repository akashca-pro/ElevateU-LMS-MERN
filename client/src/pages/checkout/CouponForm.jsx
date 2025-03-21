import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";

const CouponForm = ({ couponCode, setCouponCode, onApplyCoupon, couponApplied, onRemoveCoupon }) => {
  return (
    <div className="pt-2">
      <Label htmlFor="couponCode" className="text-sm">
        Have a coupon?
      </Label>
      <div className="flex mt-1">
        <Input
          id="couponCode"
          placeholder="Enter coupon code"
          value={couponCode}
          onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
          className="rounded-r-none"
          disabled={couponApplied} // Disable input if coupon is applied
        />
        <Button onClick={onApplyCoupon} className="rounded-l-none" disabled={couponApplied}>
          Apply
        </Button>
      </div>

      {couponApplied ? (
        <div className="mt-2 flex items-center gap-2">
          <Badge variant="success" className="flex items-center gap-1">
            Coupon Applied
            <X
              className="w-3 h-3 cursor-pointer hover:text-red-500"
              onClick={onRemoveCoupon}
            />
          </Badge>
        </div>
      ) : (
        <p className="text-xs text-gray-500 mt-1">Try "WELCOME20" for 20% off</p>
      )}
    </div>
  );
};

export default CouponForm;