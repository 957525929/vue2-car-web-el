import service from "../utils/request";
/**
 * 新增停车场
 */
export function ParkingAdd(data = {}) {
  console.log("1`11212");
  return service.request({
    method: "post",
    url: "/parking/add/",
    data,
  });
}
