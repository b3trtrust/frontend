import { createBrowserRouter, createRoutesFromElements, Route, RouterProvider } from "react-router-dom"
import * as Pages from "@/pages"

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route>
      <Route path="/"                    element={<Pages.Home />} />
      <Route path="/jobs"                element={<Pages.Jobs />} />
      <Route path="/arbitrators"         element={<Pages.Arbitrators />} />
      <Route path="/bidders"             element={<Pages.Bidders />} />
      <Route path="/jobs/:id"            element={<Pages.EscrowDetail />} />
      <Route path="/escrow/create"       element={<Pages.CreateEscrow />} />
      <Route path="/escrow/:id/manage"   element={<Pages.ManageEscrow />} />
      <Route path="/profile/bidder/:id"       element={<Pages.BidderProfile />} />
      <Route path="/profile/arbitrator/:id"  element={<Pages.ArbitratorProfile />} />
      <Route path="/profile/:wallet"         element={<Pages.PublicProfile />} />
      <Route path="/dashboard"           element={<Pages.Dashboard />} />
      <Route path="/register/bidder"     element={<Pages.RegisterBidder />} />
      <Route path="/register/arbitrator" element={<Pages.RegisterArbitrator />} />
      <Route path="/admin"               element={<Pages.SuperAdmin />} />
    </Route>
  )
)

export default () => <RouterProvider router={router} />
