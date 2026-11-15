namespace midi2027.API.Models
{
    public class MapLocation
    {
        public Guid Id { get; set; } = Guid.NewGuid();
        public required string Name { get; set; }
        public string? Description { get; set; }
        public double Lat { get; set; }
        public double Lng { get; set; }
        public string? Category { get; set; }
        public string? Color { get; set; } = "#3b82f6";
    }

    public class CreateUpdateLocationDto
    {
        public required string Name { get; set; }
        public string? Description { get; set; }
        public double Lat { get; set; }
        public double Lng { get; set; }
        public string? Category { get; set; }
        public string? Color { get; set; }
    }
}