"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Home, BarChart2, Settings, Info, Menu, X, Lightbulb } from "lucide-react"
import Logo from "./Logo"

interface NavbarProps {
  currentPage: string
  onPageChange: (page: string) => void
}

export default function Navbar({ currentPage, onPageChange }: NavbarProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  const handleNavClick = (page: string) => {
    onPageChange(page)
    setIsMenuOpen(false) // Close mobile menu when item is clicked
  }

  return (
    <nav className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <Logo className="w-8 h-8" />
            <span className="text-xl font-bold text-blue-600">Jagamudi</span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            <NavItem
              icon={<Home className="w-4 h-4 mr-2" />}
              label="Beranda"
              active={currentPage === "beranda"}
              onClick={() => handleNavClick("beranda")}

            />
            <NavItem
              icon={<Settings className="w-4 h-4 mr-2" />}
              label="Pengaturan"
              active={currentPage === "pengaturan"}
              onClick={() => handleNavClick("pengaturan")}
            />
            <NavItem
              icon={<Lightbulb className="w-4 h-4 mr-2" />}
              label="Tips"
              active={currentPage === "tips"}
              onClick={() => handleNavClick("tips")}
            />
            <NavItem
              icon={<Info className="w-4 h-4 mr-2" />}
              label="Tentang"
              active={currentPage === "tentang"}
              onClick={() => handleNavClick("tentang")}
            />
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <Button variant="ghost" size="icon" onClick={toggleMenu}>
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden bg-white shadow-lg">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <MobileNavItem
              icon={<Home className="w-4 h-4 mr-3" />}
              label="Beranda"
              active={currentPage === "beranda"}
              onClick={() => handleNavClick("beranda")}
            />
            <MobileNavItem
              icon={<BarChart2 className="w-4 h-4 mr-3" />}
              label="Statistik"
              active={currentPage === "statistik"}
              onClick={() => handleNavClick("statistik")}
            />
            <MobileNavItem
              icon={<Settings className="w-4 h-4 mr-3" />}
              label="Pengaturan"
              active={currentPage === "pengaturan"}
              onClick={() => handleNavClick("pengaturan")}
            />
            <MobileNavItem
              icon={<Lightbulb className="w-4 h-4 mr-3" />}
              label="Tips"
              active={currentPage === "tips"}
              onClick={() => handleNavClick("tips")}
            />
            <MobileNavItem
              icon={<Info className="w-4 h-4 mr-3" />}
              label="Tentang"
              active={currentPage === "tentang"}
              onClick={() => handleNavClick("tentang")}
            />
          </div>
        </div>
      )}
    </nav>
  )
}

interface NavItemProps {
  icon: React.ReactNode
  label: string
  active?: boolean
  onClick: () => void
}

function NavItem({ icon, label, active = false, onClick }: NavItemProps) {
  return (
    <button
      onClick={onClick}
      className={`px-3 py-2 rounded-md text-sm font-medium flex items-center transition-colors ${
        active ? "bg-blue-50 text-blue-700" : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
      }`}
    >
      {icon}
      {label}
    </button>
  )
}

function MobileNavItem({ icon, label, active = false, onClick }: NavItemProps) {
  return (
    <button
      onClick={onClick}
      className={`w-full text-left px-3 py-2 rounded-md text-base font-medium flex items-center transition-colors ${
        active ? "bg-blue-50 text-blue-700" : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
      }`}
    >
      {icon}
      {label}
    </button>
  )
}
