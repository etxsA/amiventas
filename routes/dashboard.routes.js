import e from "express";

const router = e.Router();



router.get('/dashboard', (req, res) => {
    res.sendFile('dashboard.html', { root: "public" });
});

router.get('/dashboard/inventory', (req, res) => {
    res.sendFile('inventory.html', {root: "public"});
});
export default router; 