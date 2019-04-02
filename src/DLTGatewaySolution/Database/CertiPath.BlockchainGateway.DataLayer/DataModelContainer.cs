using System;
using System.Diagnostics;

namespace CertiPath.BlockchainGateway.DataLayer
{
    public partial class DataModelContainer
    {
        public DataModelContainer(string configName)
            : base($"name={configName}")
        {
        }
        static EnvironmentalBuilder internalBuilder = new EnvironmentalBuilder();

        public static IBuilder Builder()
        {
            return internalBuilder;
        }

        public interface IBuilder
        {
            DataModelContainer Build();
        }

        /// <summary>
        /// Builds <see cref="DataModelContainer"/> for production or development
        /// environment using <see cref="Environment.GetEnvironmentVariable"/>.
        /// </summary>
        public class EnvironmentalBuilder : IBuilder
        {
            /// <summary>
            /// The suffix to be added to a base config name for switching
            /// to a development connection string.
            /// Example:
            ///   <connectionStrings>
            ///       <add name = "DataModelContainer_developer" connectionString=...
            ///   </connectionStrings>
            /// </summary>
            private readonly string developmentSuffix;

            /// <summary>
            /// The value of the `name` attribute in the config element for
            /// connection string.
            /// Example:
            ///   <connectionStrings>
            ///       <add name = "DataModelContainer" connectionString=...
            ///   </connectionStrings>
            /// </summary>
            public const string PRODUCTION_CONFIG_NAME = "DataModelContainer";
            public const string ENV_VAR_NAME_DEV_CONFIG_SUFFIX = "DevConfigSuffix";

            private string effectiveConfigName;

            public string GetEffectiveConfigName()
            {
                return $"{PRODUCTION_CONFIG_NAME}{developmentSuffix}";
            }

            public EnvironmentalBuilder()
            {
                developmentSuffix = 
                    $"{Environment.GetEnvironmentVariable(ENV_VAR_NAME_DEV_CONFIG_SUFFIX)}";

                Debug.Assert(!string.IsNullOrWhiteSpace(developmentSuffix),
                    "In DEBUG mode, you should set the environment variable " +
                    $"`{ENV_VAR_NAME_DEV_CONFIG_SUFFIX}` to switch between production and " +
                    "development connection strings.");
            }

            public DataModelContainer Build()
            {
                if (string.IsNullOrEmpty(effectiveConfigName))
                {
                    effectiveConfigName = $"{GetEffectiveConfigName()}";
                }

                Trace.TraceInformation($"Returning DataModelContainer using config name '{effectiveConfigName}'");
                var dataModelContainer = new DataModelContainer(effectiveConfigName);

                Debug.Assert(dataModelContainer.Database.Exists(),
                    $"Cannot connect to the database. Connection string: '{dataModelContainer.Database.Connection.ConnectionString}'");

                return dataModelContainer;
            }
        }
    }
}