using System.Text.Json;
using midi2027.API.Models;

namespace midi2027.API.Services
{
    public class MapLocationService
    {
        private readonly string _filePath;
        private readonly SemaphoreSlim _lock = new(1, 1);
        private static readonly JsonSerializerOptions _jsonOptions = new() { WriteIndented = true };

        public MapLocationService(IWebHostEnvironment env)
        {
            var appDataPath = Path.Combine(env.ContentRootPath, "App_Data");
            Directory.CreateDirectory(appDataPath);
            _filePath = Path.Combine(appDataPath, "locations.json");
        }

        public async Task<List<MapLocation>> GetAllAsync()
        {
            await _lock.WaitAsync();
            try
            {
                return await ReadFromFileAsync();
            }
            finally
            {
                _lock.Release();
            }
        }

        public async Task<MapLocation> CreateAsync(CreateUpdateLocationDto dto)
        {
            await _lock.WaitAsync();
            try
            {
                var locations = await ReadFromFileAsync();
                var newLocation = new MapLocation
                {
                    Id = Guid.NewGuid(),
                    Name = dto.Name,
                    Description = dto.Description,
                    Lat = dto.Lat,
                    Lng = dto.Lng,
                    Category = dto.Category,
                    Color = string.IsNullOrWhiteSpace(dto.Color) ? "#3b82f6" : dto.Color
                };

                locations.Add(newLocation);
                await WriteToFileAsync(locations);
                return newLocation;
            }
            finally
            {
                _lock.Release();
            }
        }

        public async Task<MapLocation?> UpdateAsync(Guid id, CreateUpdateLocationDto dto)
        {
            await _lock.WaitAsync();
            try
            {
                var locations = await ReadFromFileAsync();
                var existing = locations.FirstOrDefault(x => x.Id == id);
                if (existing == null) return null;

                existing.Name = dto.Name;
                existing.Description = dto.Description;
                existing.Lat = dto.Lat;
                existing.Lng = dto.Lng;
                existing.Category = dto.Category;
                if (!string.IsNullOrWhiteSpace(dto.Color)) existing.Color = dto.Color;

                await WriteToFileAsync(locations);
                return existing;
            }
            finally
            {
                _lock.Release();
            }
        }

        public async Task<bool> DeleteAsync(Guid id)
        {
            await _lock.WaitAsync();
            try
            {
                var locations = await ReadFromFileAsync();
                var removed = locations.RemoveAll(x => x.Id == id);
                if (removed == 0) return false;

                await WriteToFileAsync(locations);
                return true;
            }
            finally
            {
                _lock.Release();
            }
        }

        private async Task<List<MapLocation>> ReadFromFileAsync()
        {
            if (!File.Exists(_filePath))
            {
                var defaultData = new List<MapLocation>
                {
                    new()
                    {
                        Name = "MIDI būstinė Vilniuje",
                        Description = "VU MIF Studentų atstovybė",
                        Lat = 54.6872,
                        Lng = 25.2797,
                        Category = "Būstinė",
                        Color = "#3b82f6"
                    }
                };
                await WriteToFileAsync(defaultData);
                return defaultData;
            }

            var json = await File.ReadAllTextAsync(_filePath);
            return JsonSerializer.Deserialize<List<MapLocation>>(json) ?? new List<MapLocation>();
        }

        private async Task WriteToFileAsync(List<MapLocation> locations)
        {
            var json = JsonSerializer.Serialize(locations, _jsonOptions);
            await File.WriteAllTextAsync(_filePath, json);
        }
    }
}