const response = {
  success: true,
  data: {
    id: "123",
    role: "super_admin"
  }
};
const payload = response?.data ?? response;
const candidate = payload.user ?? payload.data ?? payload;
let finalResult = candidate;
if (candidate.user || candidate.data) {
  finalResult = candidate.user ?? candidate.data ?? null;
}
console.log(finalResult);
