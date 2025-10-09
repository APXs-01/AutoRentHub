import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { vehicleService } from '../services/vehicleService';
import LoadingSpinner from '../components/common/LoadingSpinner';

const Badge = ({ children }) => (
  <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-white/90 ring-1 ring-white/20 backdrop-blur">
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" className="opacity-80">
      <path d="M12 2l2.39 4.84L20 8l-4 3.9.95 5.53L12 15.77 7.05 17.43 8 13.9 4 10l5.61-.84L12 2z" stroke="currentColor" strokeWidth="1.5"/>
    </svg>
    {children}
  </span>
);

const Feature = ({ icon, title, desc, accent }) => (
  <div className="group relative overflow-hidden rounded-2xl bg-white p-6 shadow-[0_10px_30px_rgba(2,6,23,0.07)] ring-1 ring-black/5 transition hover:-translate-y-1 hover:shadow-lg">
    <div className={`mb-5 inline-flex h-12 w-12 items-center justify-center rounded-xl ${accent}`}>
      <span className="text-2xl">{icon}</span>
    </div>
    <h3 className="mb-1.5 text-lg font-semibold text-slate-900">{title}</h3>
    <p className="text-slate-600">{desc}</p>
    <div className="pointer-events-none absolute -right-8 -top-8 h-24 w-24 rounded-full bg-slate-100 opacity-0 blur-xl transition group-hover:opacity-70"></div>
  </div>
);

const Stat = ({ kpi, label }) => (
  <div className="rounded-2xl bg-white/70 p-5 text-center ring-1 ring-black/5 backdrop-blur">
    <div className="text-3xl font-bold tracking-tight text-slate-900">{kpi}</div>
    <div className="mt-1 text-sm text-slate-600">{label}</div>
  </div>
);

const VehicleCard = ({ name, tag, img, price, to }) => (
  <Link
    to={to}
    className="group relative block overflow-hidden rounded-2xl bg-white ring-1 ring-black/5 shadow-[0_10px_30px_rgba(2,6,23,0.07)] transition hover:-translate-y-1 hover:shadow-lg"
  >
    <img src={img} alt={name} className="h-44 w-full object-cover transition group-hover:scale-105" />
    <div className="p-5">
      <div className="mb-2 flex items-center justify-between">
        <h4 className="text-lg font-semibold text-slate-900">{name}</h4>
        <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700 capitalize">{tag}</span>
      </div>
      <div className="flex items-center justify-between">
        <span className="text-slate-600">from</span>
        <span className="text-base font-semibold text-slate-900">{price}</span>
      </div>
    </div>
  </Link>
);

const Home = () => {
  const { user } = useAuth();
  
  // State for vehicles and loading
  const [popularVehicles, setPopularVehicles] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch vehicles when the component mounts
  useEffect(() => {
    const fetchPopularVehicles = async () => {
      try {
        setLoading(true);
        // Fetch the 3 newest available vehicles
        const response = await vehicleService.getVehicles({ 
          limit: 3, 
          sortBy: 'createdAt', 
          sortOrder: 'desc' 
        });
        if (response.success) {
          setPopularVehicles(response.data);
        }
      } catch (error) {
        console.error("Failed to fetch popular vehicles:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPopularVehicles();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      
      {/* HERO SECTION */}
      <section className="relative isolate overflow-hidden">
        <div className="absolute inset-0 -z-10 bg-[linear-gradient(120deg,#2563eb,#7c3aed,#0ea5e9,#22c55e)] [background-size:300%_300%] animate-[gradientShift_14s_ease_infinite]"></div>
        <div className="absolute inset-0 -z-10 opacity-20 [background:radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.25)_1px,transparent_0)] bg-[length:22px_22px]"></div>
        <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center py-32 text-center md:py-40">
            <div className="mb-5">
              <Badge>New: Weekend Deals up to 25% off</Badge>
            </div>
            <h1 className="max-w-3xl text-4xl font-extrabold tracking-tight text-white md:text-6xl">
              Your journey starts with the perfect ride
            </h1>
            <p className="mt-5 max-w-2xl text-lg text-white/85 md:text-xl">
              Rent cars and bikes with ease—transparent pricing, flexible pickup, and 24/7 support wherever you go.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                to="/vehicles"
                className="inline-flex items-center justify-center rounded-xl bg-white px-6 py-3 text-base font-semibold text-slate-900 shadow-[0_10px_30px_rgba(2,6,23,0.07)] ring-1 ring-black/5 hover:bg-slate-100"
              >
                Browse Vehicles
              </Link>
              {!user && (
                <Link
                  to="/register"
                  className="inline-flex items-center justify-center rounded-xl bg-white/10 px-6 py-3 text-base font-semibold text-white ring-1 ring-white/30 hover:bg-white/20"
                >
                  Create an Account
                </Link>
              )}
            </div>
            <div className="mt-10 grid w-full max-w-3xl grid-cols-3 gap-4">
              <Stat kpi="4.8★" label="Avg. customer rating" />
              <Stat kpi="1,200+" label="Vehicles available" />
              <Stat kpi="95%" label="On-time pickups" />
            </div>
          </div>
        </div>
        <svg className="absolute bottom-0 left-0 right-0" viewBox="0 0 1440 120" preserveAspectRatio="none" aria-hidden="true">
          <path d="M0,40 C240,120 480,0 720,40 C960,80 1200,120 1440,40 L1440,120 L0,120 Z" fill="#f8fafc"></path>
        </svg>
      </section>

      {/* FEATURES */}
      <section id="features" className="py-16 md:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto mb-10 max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-slate-900 md:text-4xl">
              Why choose Auto Rent Hub?
            </h2>
            <p className="mt-3 text-slate-600">
              Modern fleet, clear pricing, and human support—so you can focus on the road.
            </p>
          </div>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            <Feature icon="🚗" title="Wide Selection" desc="From compact EVs to adventure-ready SUVs and premium bikes—pick the ride that fits your moment." accent="bg-blue-100 text-blue-700" />
            <Feature icon="💳" title="Transparent Pricing" desc="No hidden fees. See the total before you book, with flexible add-ons only if you need them." accent="bg-emerald-100 text-emerald-700" />
            <Feature icon="🛟" title="24/7 Support" desc="Real people ready to help with pickup, roadside assistance, and last-minute changes." accent="bg-violet-100 text-violet-700" />
          </div>
        </div>
      </section>

      {/* POPULAR TEASER */}
      <section className="pb-6 md:pb-10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-6 flex items-end justify-between">
            <div>
              <h3 className="text-2xl font-bold text-slate-900">Popular right now</h3>
              <p className="mt-1 text-slate-600">A snapshot of what renters are loving this week.</p>
            </div>
            <Link to="/vehicles" className="hidden rounded-lg bg-slate-900 px-4 py-2 text-white hover:bg-slate-800 md:inline-block">
              See all
            </Link>
          </div>

          {loading ? (
            <div className="flex justify-center p-10"><LoadingSpinner /></div>
          ) : (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {popularVehicles.map((vehicle) => (
                <VehicleCard
                  key={vehicle._id}
                  name={`${vehicle.brand} ${vehicle.model}`}
                  tag={vehicle.vehicleType}
                  img={vehicle.images?.[0]?.url || 'https://via.placeholder.com/400x300'}
                  price={`$${vehicle.pricePerDay} / day`}
                  to={`/vehicles/${vehicle._id}`}
                />
              ))}
            </div>
          )}

          <div className="mt-6 text-center md:hidden">
            <Link to="/vehicles" className="inline-block rounded-lg bg-slate-900 px-4 py-2 text-white hover:bg-slate-800">
              See all
            </Link>
          </div>
        </div>
      </section>

      {/* TESTIMONIAL STRIP */}
      <section className="py-14">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            <div className="rounded-2xl bg-white p-6 ring-1 ring-black/5 shadow-[0_10px_30px_rgba(2,6,23,0.07)]"><p className="text-slate-700">“Pickup was seamless and the car was spotless. Best price I found.”</p><div className="mt-4 text-sm text-slate-500">— Ayesha P.</div></div>
            <div className="rounded-2xl bg-white p-6 ring-1 ring-black/5 shadow-[0_10px_30px_rgba(2,6,23,0.07)]"><p className="text-slate-700">“Extended my booking in two taps. Support was instantly helpful.”</p><div className="mt-4 text-sm text-slate-500">— Kasun R.</div></div>
            <div className="rounded-2xl bg-white p-6 ring-1 ring-black/5 shadow-[0_10px_30px_rgba(2,6,23,0.07)]"><p className="text-slate-700">“Loved the bike options—perfect for quick city trips.”</p><div className="mt-4 text-sm text-slate-500">— Nethmi S.</div></div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative overflow-hidden bg-slate-900">
        <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(circle at 20% 10%, #fff 0, transparent 25%), radial-gradient(circle at 80% 50%, #fff 0, transparent 25%)' }} />
        <div className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="text-3xl font-bold text-white md:text-4xl">Ready to hit the road?</h2>
            <p className="mt-3 text-white/80">
              Book your perfect vehicle in just a few clicks. Plans change? Free cancellation up to 24 hours before pickup.
            </p>
            <div className="mt-6">
              <Link
                to="/vehicles"
                className="inline-flex items-center justify-center rounded-xl bg-white px-6 py-3 text-base font-semibold text-slate-900 shadow-[0_10px_30px_rgba(2,6,23,0.07)] ring-1 ring-white/20 hover:bg-slate-100"
              >
                Start Booking Now
              </Link>
            </div>
          </div>
        </div>
      </section>
      
      <br></br>
      
      <style>{`
        @keyframes gradientShift {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
      `}</style>
    </div>
  );
};

export default Home;